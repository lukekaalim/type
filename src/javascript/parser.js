// @flow strict
/*::
import type { ValueToken, TypeToken } from './token.js';
import type { TypeID } from '../type.js';
import type { Program, ProgramState } from '../program.js';
import type { InstanceID, Instance } from '../instance.js';
import type { RecordFactory, RecordOf } from 'immutable';
import type { Statement } from '../statements.js';
import type { FunctionSignature } from './signature.js';
import type { SourceLocation } from './source.js';
import type { ECMAScriptPrimitives } from './ecma.js';
import type { AnnotationStatement } from './annotation.js';
import type { JSValues } from './values.js';
import type { ScopeID, Scope, IdentifierID, Identifier } from '../javascript';
*/
import immutable from 'immutable';
const { Record, Map, List } = immutable;

import acorn from 'acorn';
const { parse } = acorn;
import { createFunctionSignature } from './signature.js';
import { createSourceLocation } from './source.js';
import { createInstanceToken } from './token.js';
import { createInstance } from '../instance.js';
import { createSimpleType } from '../type.js';
import { createProgram, runProgram, createProgramState } from '../program.js';
import { exit, createValue, constrain, branch } from '../statements.js';
import { createConstraint } from '../constraint.js';
import { generateTypesForValues, generateRelationshipsForTypes, createJsValues } from './values.js';
import { createEcmaScriptPrimitives, createTypeTokensForPrimitives } from './ecma.js';
import { createVariantRelationship } from '../relationship.js';
import { parseArrowFunctionExpression } from './jsValues/function.js';
import { createAnnotationFromString } from './annotationParser.js';

/*:: 
type LumberStateProps = {
  // Meta type information
  sourceCode: string,
  annotations: Map<SourceLocation, AnnotationStatement>,
  primitives: ECMAScriptPrimitives,
  // Javascript state tracking
  valueTokens: Map<string, ValueToken>,
  typeTokens: Map<string, TypeToken>,
  functionSignatures: List<FunctionSignature>,
  scopes: Map<ScopeID, Scope>,
  identifiers: Map<IdentifierID, Identifier>,
  // sawmill program generation
  // (this should just be a program);
  initialSawmillState: RecordOf<ProgramState>,
  statements: List<Statement>,

  values: JSValues,
  // signature generation (this should be abstracted)
  returnValueId: null | InstanceID,
  throwValueId: null | InstanceID,
  argumentValuesIds: List<InstanceID>,
};

export type LumberState = RecordOf<LumberStateProps>;
*/

const initialPrimitives = createEcmaScriptPrimitives();

const createLumberState/*: RecordFactory<LumberStateProps>*/ = Record({
  sourceCode: '',
  annotations: Map(),
  primitives: initialPrimitives,

  valueTokens: Map(),
  typeTokens: Map().merge(createTypeTokensForPrimitives(initialPrimitives)),
  functionSignatures: List(),

  scopes: Map(),
  identifers: Map(),

  initialSawmillState: createProgramState(),

  statements: List(),
  values: createJsValues(),

  returnValueId: null,
  throwValueId: null,
  argumentValuesIds: List(),
}, 'JSParserState');

const variableDeclarator = (state, declarator) => {
  switch (declarator.init.type) {
    default:
      return state;
    case 'ArrowFunctionExpression':
      const jsFunction = parseArrowFunctionExpression(state, declarator.init);
      console.log(jsFunction.signatures);
      return state;
  }
};

const variableDeclaration = (state, variableNode) => {
  return variableNode.declarations.reduce((state, declaratorNode) => {
    return variableDeclarator(state, declaratorNode);
  }, state);
};

const getLiteralBoolean = (state, value) => {
  const existingValue = state.staticValues.find(
    staticValue => staticValue.type === 'literal-boolean' &&
      staticValue.value === value,
    null,
    null
  );
  if (existingValue) {
    return existingValue;
  }
  return createLiteralBoolean(value);
};

const getLiteralValue = (state, literalValue) => {
  switch (typeof literalValue) {
    case 'boolean':
      return getLiteralBoolean(state, literalValue);
  }

  if (typeof literalValue !== 'number') {
    throw new Error(`There's no known type for the type identifier: "${typeof literalValue}"`)
  }

  const isLiteralNumber = value => value.type === 'literal-number' && value.value === literalValue;
  const existingLiteralNumber = state.staticValues.find(isLiteralNumber, null, null);

  return existingLiteralNumber !== null ? existingLiteralNumber : createLiteralNumber(literalValue);
};

const returnDeclaration = (state, returnNode) => {
  if (returnNode.argument.type !== 'Literal') {
    console.warn('Unexpected Syntax in return statement; We don\'t support this yet!');
    return state;
  }

  const returnValue = getLiteralValue(state, returnNode.argument.value);

  const returnSawmillValue = createInstance(returnValue.valueType.id);

  return state
    .update('staticValues', values => values.set(returnValue.id, returnValue))
    .update('statements', statements => statements
      .push(createValue(returnSawmillValue))
      .push(exit())
    )
    .set('returnValue', returnSawmillValue.id)
};

const ifStatement = (state, node) => {
  const testValueToken = state.valueTokens.get(node.test.name);
  console.log(node.test);
  console.log(state.valueTokens.toJS());
  if (!testValueToken)
    throw new Error();
  const trueValue = getLiteralValue(state, true);

  const lumberState = statement(node.consequent.body, state);
  const ifProgram = createProgram({ statements: lumberState.statements, initialState: lumberState.initialSawmillState })

  return state
    .update('staticValues', values => values.set(trueValue.id, trueValue))
    .update('statements', statements => statements
      .push(branch(trueValue.valueType.id, testValueToken.valueId, ifProgram, createProgram()))
    )
};

const statement = (body/*: EstreeStatement[]*/, initialState/*: LumberState*/)/*: LumberState*/ => {
  return body.reduce((state, node) => {
    switch (node.type) {
      case 'IfStatement':
        return ifStatement(state, node);
      case 'VariableDeclaration':
        return variableDeclaration(state, node);
      case 'ReturnStatement':
        return returnDeclaration(state, node);
      default:
        console.warn(`Skipping statement type: "${node.type}"; We don\'t support this yet!`)
        return state;
    }
  }, initialState);
};

const createNumericRelationship = (state, literalNumberValue) => {
  return state
    .update('initialSawmillState', sawmillState => sawmillState
      .update('types', types => types.set(literalNumberValue.valueType.id, literalNumberValue.valueType))
    )
};

const createStaticRelationships = (state/*: LumberState*/) => {
  const types = generateTypesForValues(state.values);
  const relationships = generateRelationshipsForTypes(state.primitives, state.values);

  return state
    .update('initialSawmillState', sawmill => sawmill
      .update('types', sawmillTypes => sawmillTypes.merge(types.map(type => [type.id, type])))
      .update('variantRelationships', sawmillRelationships => sawmillRelationships.merge(relationships))
    );
};

const getProgramFromSource = (
  source/*: string*/,
  initialState/*: LumberState*/ = createLumberState()
) => {
  const commentAnnotations = [];
  const onComment = (isBlock, content, start, end) => {
    commentAnnotations.push([createSourceLocation(start, end), createAnnotationFromString(content)]);
  };
  const estree = parse(source, { onComment });
  const stateWithAnnotations = initialState
    .update('annotations', annotations => annotations.merge(commentAnnotations));
  const stateWithSource = stateWithAnnotations
    .set('sourceCode', source);

  return createStaticRelationships(statement(estree.body, stateWithSource));
};

const exported = {
  createLumberState,
  getProgramFromSource,
  createStaticRelationships,
  statement
};

export default exported;
export { createLumberState, getProgramFromSource, createStaticRelationships, statement };