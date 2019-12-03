// @flow strict
import generateUUID from 'uuid/v4.js';
import immutable from 'immutable';
const { List, Map } = immutable;

import { getLineFromIndex } from '../source.js';
import { createSimpleType } from '../../type.js';
import { createInstance } from '../../instance.js';
import { createFunctionAnnotation } from '../annotation.js';
import { createSourceLocation } from '../source.js';
import { createInstanceToken } from '../token.js';
import { createStaticRelationships, statement } from '../parser.js';
import { runProgram, createProgram } from '../../program.js';
import { createValue } from '../../statements.js';
import { createFunctionSignature } from '../signature.js';
import { createVariantRelationship } from '../../relationship.js';
/*::
import type { LumberState } from '../parser.js';
import type { Type, TypeID } from '../../type.js';
import type { SourceLocation } from '../source.js';
import type { FunctionExpressionAnnotation } from '../annotation.js';
import type { TypeToken } from '../token.js';
import type { RecordOf } from 'immutable';
import type { JSValues } from '../values';
import type { Program } from '../../program';
import type { FunctionSignature } from '../signature';
import type { Relationship } from '../../relationship';
*/

const findAnnotation = (state, arrowFunctionExpression) => {
  const functionLine = getLineFromIndex(state.sourceCode, arrowFunctionExpression.start);
  return state.annotations.find((functionAnnotation, annotationLocation) =>
    getLineFromIndex(state.sourceCode, annotationLocation.end) + 1 === functionLine,
    null,
    createFunctionAnnotation([], null, null),
  );
};

/*::
type JSFunctionID = string;
type JSFunction = {
  id: JSFunctionID,
  type: Type,
  values: RecordOf<JSValues>,
  signatures: FunctionSignature[],
  program: RecordOf<Program>,
};

export type {
  JSFunction,
  JSFunctionID,
};
*/

const createParamValues = (state, parametersAnnotations) => {
  const paramsAnnotation = parametersAnnotations
    .map(annotation => {
      switch (annotation.type) {
        case 'value-literal':
          throw new Error('Don\'t support Type literals yet');
        default:
          throw new Error('Impossible case');
        case 'type-identifier':
          const token = state.typeTokens.get(annotation.identifier);
          if (!token)
            throw new Error();
          return token;
      }
    });

  return paramsAnnotation.map(token =>  createInstance(token.typeId));
};

const parseArrowFunctionExpression = (
  state/*: RecordOf<LumberState>*/,
  arrowFunctionExpression/*: EstreeArrowFunctionExpression*/,
  annotation/*: FunctionExpressionAnnotation*/ = findAnnotation(state, arrowFunctionExpression)
)/*: JSFunction*/ => {
  const type = createSimpleType();
  const instance = createInstance(type.id);

  const paramInstances = createParamValues(state, annotation.parameters);
  const valueTokens = paramInstances.map((instance, index) =>
    createInstanceToken(arrowFunctionExpression.params[index].name, instance.id)
  );

  const functionInitialState = state
    .update('initialSawmillState', sawmill => sawmill.update('values', values => values.merge(paramInstances.map(p => [p.id, p]))))
    .update('valueTokens', tokens => tokens.merge(valueTokens.map(vt => [vt.identifier, vt])))
    .set('argumentValuesIds', List(paramInstances.map(p => p.id)))

  const functionFinalState = createStaticRelationships(statement(arrowFunctionExpression.body.body, functionInitialState));
  const { values, statements, initialSawmillState } = functionFinalState;

  const program = createProgram({ statements, initialState: initialSawmillState });
  const sawmillStates = runProgram(program, initialSawmillState);

  const signatures = sawmillStates.map(s => createFunctionSignature(functionFinalState, s));

  return {
    id: generateUUID(),
    type,
    values,
    signatures,
    program,
  };
};

const generateRelationshipsForFunctions = (functionTypeId/*: TypeID*/, functions/*: List<JSFunction>*/) => {
  return [createVariantRelationship(functionTypeId, functions.map(func => func.type.id).toArray())];
};

const generateTypesForFunctions = (functions/*: List<JSFunction>*/) => {
  return functions
    .map(func => func.type);
};

export { parseArrowFunctionExpression, generateRelationshipsForFunctions, generateTypesForFunctions };
