// @flow strict
import { getLineFromIndex } from '../source.js';
import generateUUID from 'uuid/v4.js';

import { createSimpleType } from '../../type.js';
import { createInstance } from '../../instance.js';
import { createFunctionAnnotation } from '../annotation.js';
import { createSourceLocation } from '../source.js';
import { createInstanceToken } from '../token.js';
import { createStaticRelationships, statement } from '../parser.js';
import { runProgram, createProgram } from '../../program.js';
import { createValue } from '../../statements.js';
import { createFunctionSignature } from '../signature.js';
import immutable from 'immutable';
const { List, Map } = immutable;
/*::
import type { LumberState } from '../parser.js';
import type { SourceLocation } from '../source.js';
import type { FunctionExpressionAnnotation } from '../annotation.js';
import type { TypeToken } from '../token.js';
import type { RecordOf } from 'immutable'
import type { JSValue, JSValueID } from '../values';
import type { Program } from '../../program';
import type { FunctionSignature } from '../signature';
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
type JsFunctionID = string;
type JsFunction = {
  id: JsFunctionID,
  type: 'function',
  values: Map<JSValueID, JSValue>,
  signatures: FunctionSignature[],
  program: RecordOf<Program>,
};

export type {
  JsFunction,
  JsFunctionID,
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
)/*: JsFunction*/ => {
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
  const { staticValues: values } = functionFinalState;

  const program = createProgram({ statements: functionFinalState.statements, initialState: functionFinalState.initialSawmillState });
  const sawmillStates = runProgram(program, functionFinalState.initialSawmillState);

  const signatures = sawmillStates.map(s => createFunctionSignature(functionFinalState, s));

  return {
    id: generateUUID(),
    type: 'function',
    values,
    signatures,
    program,
  };
};

export { parseArrowFunctionExpression };
