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
import type { ScopeID, Scope, IdentifierID, Identifier, AssignmentID, Assignment } from '../javascript';
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
  assignments: Map<AssignmentID, Assignment>,
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
  assignments: Map(),

  initialSawmillState: createProgramState(),

  statements: List(),
  values: createJsValues(),

  returnValueId: null,
  throwValueId: null,
  argumentValuesIds: List(),
}, 'JSParserState');

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

export { createLumberState, getProgramFromSource, createStaticRelationships, statement };