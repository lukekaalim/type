// @flow strict
const { getLineFromIndex } = require('../source');
const { createSimpleType } = require('../../type');
const { createInstance } = require('../../instance');
const { createFunctionAnnotation } = require('../annotation');
const { createSourceLocation } = require('../source');
const { createInstanceToken } = require('../token');
const { createStaticRelationships, statement } = require('../parser');
const { runProgram, createProgram } = require('../../program');
const { createValue } = require('../../statements');
const { createFunctionSignature } = require('../signature');
const { List } = require('immutable');
/*::
import type { LumberState } from '../parser';
import type { SourceLocation } from '../source';
import type { FunctionExpressionAnnotation } from '../annotation';
import type { TypeToken } from '../token';
import type { RecordOf } from 'immutable'
*/

const findAnnotation = (state, arrowFunctionExpression) => {
  const functionLine = getLineFromIndex(state.sourceCode, arrowFunctionExpression.start);
  return state.annotations.find((functionAnnotation, annotationLocation) =>
    getLineFromIndex(state.sourceCode, annotationLocation.end) + 1 === functionLine,
    null,
    createFunctionAnnotation([], null, null),
  );
};

const parseArrowFunctionExpression = (
  state/*: RecordOf<LumberState>*/,
  arrowFunctionExpression/*: EstreeArrowFunctionExpression*/,
  annotation/*: FunctionExpressionAnnotation*/ = findAnnotation(state, arrowFunctionExpression)
) => {
  const type = createSimpleType();
  const instance = createInstance(type.id);

  // should get arguments here, and feed them to the function state
  // as well as resetting the return & throw states

  const paramsAnnotation/*: TypeToken[]*/ = annotation.parameters
    .map(annotation => {
      switch (annotation.type) {
        case 'value-literal':
          throw new Error('Don\'t support Type literals yet');
        default:
          throw new Error('Impossible case');
        case 'type-identifier':
          const token = state.typeTokens.get(annotation.identifier);
          if (!token)
            throw new Error('Err');
          return token;
      }
    });

  const paramInstances = paramsAnnotation.map(token =>  createInstance(token.typeId));
  const valueTokens = paramInstances.map((instance, index) =>
    createInstanceToken(arrowFunctionExpression.params[index].name, instance.id)
  );

  const functionInitialState = state
    .update('initialSawmillState', sawmill => sawmill.update('values', values => values.merge(paramInstances.map(p => [p.id, p]))))
    .update('valueTokens', tokens => tokens.merge(valueTokens.map(vt => [vt.identifier, vt])))
    .set('argumentValuesIds', List(paramInstances.map(p => p.id)))


  const functionFinalState = createStaticRelationships(statement(arrowFunctionExpression.body.body, functionInitialState));

  const program = createProgram({ statements: functionFinalState.statements, initialState: functionFinalState.initialSawmillState });
  const sawmillStates = runProgram(program, functionFinalState.initialSawmillState);

  const signatures = sawmillStates.map(s => createFunctionSignature(functionFinalState, s));

  return state
    .update('staticValues', staticValues => staticValues.merge(functionFinalState.staticValues))
    .update('statements', statements => statements
      .push(createValue(instance))
    ) 
    .update('initialSawmillState', sawmill => sawmill
      .update('types', sawmillTypes => sawmillTypes.set(type.id, type))
    )
    .update('functionSignatures', allSignatures => allSignatures.merge(signatures))
};
/*
  const functionState = state
    //.update('staticValues', values => values.set(argument.id, argument))
    .update('valueTokens', tokens => tokens.set('a', createInstanceToken('a', argumentValue.id)))
    .update('statements', statements => statements
      .push(createValue(argumentValue))
    );

  const lumberState = createStaticRelationships(statement(initFunction.body.body, functionState));

  const program = createProgram({ statements: lumberState.statements });
  const sawmillState = runProgram(program, lumberState.initialSawmillState);

  const signatures = createFunctionSignatures(type.id, lumberState, sawmillState, argumentValue);

  return state
    .update('staticValues', staticValues => staticValues.merge(lumberState.staticValues))
    .update('statements', statements => statements
      .push(createValue(instance))
    ) 
    .update('initialSawmillState', sawmill => sawmill
      .update('types', sawmillTypes => sawmillTypes.set(type.id, type))
    )
    .update('functionSignatures', allSignatures => allSignatures.merge(signatures))
    .update('valueTokens', valueTokens => valueTokens.set(token.identifier, token))
};
*/

module.exports = {
  parseArrowFunctionExpression,
};
