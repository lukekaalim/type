// @flow strict
/*::
import type { Identifier, ValueToken, TypeToken } from './token';
import type { TypeID } from '../type';
import type { Program, ProgramState } from '../program';
import type { InstanceID, Instance } from '../instance';
import type { RecordFactory, RecordOf } from 'immutable';
import type { Statement } from '../statements';
import type { FunctionSignature } from './signature';
import type { JSValue, JSValueID } from './values';
import type { SourceLocation } from './source';
import type { ECMAScriptPrimitives } from './ecma';
import type { AnnotationStatement } from './annotation';
*/
const { Record, Map, List } = require('immutable');
const { parse } = require("acorn");

const { createFunctionSignature } = require('./signature');
const { createSourceLocation } = require('./source');
const { createInstanceToken } = require('./token');
const { createInstance } = require('../instance');
const { createSimpleType } = require('../type');
const { createProgram, runProgram, createProgramState } = require('../program');
const { exit, createValue, constrain, branch } = require('../statements');
const { createConstraint } = require('../constraint');
const { createLiteralNumber, createLiteralBoolean } = require('./values');
const { createEcmaScriptPrimitives } = require('./ecma');
const { createVariantRelationship } = require('../relationship');
const { parseArrowFunctionExpression } = require('./values/function');

/*:: 
export type LumberState = {
  // Meta type information
  sourceCode: string,
  annotations: Map<SourceLocation, AnnotationStatement>,
  primitives: ECMAScriptPrimitives,
  // Javascript state tracking
  valueTokens: Map<string, ValueToken>,
  typeTokens: Map<string, TypeToken>,
  functionSignatures: List<FunctionSignature>,
  initialSawmillState: RecordOf<ProgramState>,
  // sawmill program generation
  statements: List<Statement>,
  staticValues: Map<JSValueID, JSValue>,
  // signature generation
  returnValueId: null | InstanceID,
  throwValueId: null | InstanceID,
  argumentValuesIds: List<InstanceID>,
};
*/

const createLumberState/*: RecordFactory<LumberState>*/ = Record({
  sourceCode: '',
  annotations: Map(),
  primitives: createEcmaScriptPrimitives(),

  valueTokens: Map(),
  typeTokens: Map(),
  functionSignatures: List(),
  initialSawmillState: createProgramState(),

  statements: List(),
  staticValues: Map(),

  returnValueId: null,
  throwValueId: null,
  argumentValuesIds: List(),
}, 'JSParserState');

const variableDeclarator = (state, declarator) => {
  switch (declarator.init.type) {
    default:
      return state;
    case 'ArrowFunctionExpression':
      return parseArrowFunctionExpression(state, declarator.init);
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

const statement = (body/*: EstreeStatement[]*/, initialState/*: RecordOf<LumberState>*/)/*: RecordOf<LumberState>*/ => {
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

const createStaticRelationships = (state/*: RecordOf<LumberState>*/) => {
  const booleans = [createSimpleType()];
  for (const value of state.staticValues.values())
    value.type === 'literal-boolean' && booleans.push(value.valueType);
  
  return state.staticValues.reduce((state, value) => {
    switch (value.type) {
      case 'literal-number':
        return createNumericRelationship(state, value);
      default:
        return state;
    }
  }, state)
    .update('initialSawmillState', initialSawmillState => initialSawmillState
      .update('types', types => types
        .merge(booleans.map(v => [v.id, v]))
        .set(state.primitives.boolean.id, state.primitives.boolean)
      )
      .update('variantRelationships', relationships => relationships
        .push(createVariantRelationship(state.primitives.boolean.id, booleans.map(value => value.id)))
      )
    );
};

const getProgramFromSource = (
  source/*: string*/,
  initialState/*: RecordOf<LumberState>*/ = createLumberState()
) => {
  const estree = parse(source);
  return createStaticRelationships(statement(estree.body, initialState));
};

module.exports = {
  createLumberState,
  getProgramFromSource,
  createStaticRelationships,
  statement,
};