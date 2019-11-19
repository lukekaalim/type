// @flow strict
/*::
import type { Identifier, ValueToken, TypeToken } from './token';
import type { TypeID } from '../type';
import type { Program, ProgramState } from '../program';
import type { AnnotationID, Annotation } from './annotation';
import type { InstanceID, Instance } from '../instance';
import type { RecordFactory, RecordOf } from 'immutable';
import type { Statement } from '../statements';
import type { FunctionSignature } from './signature';
import type { JSValue, JSValueID } from './values';
*/
const { Record, Map, List } = require('immutable');
const { parse } = require("acorn");

const { createFunctionSignatures } = require('./signature');
const { createSourceLocation } = require('./source');
const { createInstanceToken } = require('./token');
const { createInstance } = require('../instance');
const { createSimpleType } = require('../type');
const { createProgram, runProgram, createProgramState } = require('../program');
const { exit, createValue, constrain } = require('../statements');
const { createConstraint } = require('../constraint');
const { createLiteralNumber } = require('./values');

/*:: 
export type LumberState = {
  // Meta type information
  annotations: Map<AnnotationID, Annotation>,
  // Javascript state tracking
  valueTokens: Map<string, ValueToken>,
  typeTokens: Map<string, TypeToken>,
  functionSignatures: List<FunctionSignature>,
  initalSawmillState: RecordOf<ProgramState>,
  // sawmill program generation
  statements: List<Statement>,
  values: Map<JSValueID, JSValue>,
  // signiture generation
  returnValue: null | InstanceID,
  throwValue: null | InstanceID,
  argumentValues: List<InstanceID>,
};
*/
const createLumberState/*: RecordFactory<LumberState>*/ = Record({
  annotations: Map(),

  valueTokens: Map(),
  typeTokens: Map(),
  functionSignatures: List(),
  initalSawmillState: createProgramState(),

  statements: List(),
  values: Map(),

  returnValue: null,
  throwValue: null,
  argumentValues: List(),
}, 'JSParserState');

const functionDeclarator = (state, declarator, initFunction) => {
  // Every function is unique
  const type = createSimpleType();
  const instance = createInstance(type.id);
  const token = createInstanceToken(declarator.id.name, instance.id);

  // should get arguments here, and feed them to the function state
  // as well as reseting the return & throw states

  const lumberState = statement(initFunction.body.body, state);

  const program = createProgram({ statements: lumberState.statements });
  const sawmillState = runProgram(program, createProgramState());

  const signatures = createFunctionSignatures(type.id, lumberState, sawmillState);

  return state
    .update('statements', statements => statements
      .push(createValue(instance))
      .push(constrain(createConstraint(instance.id, type.id)))
    )
    .update('initalSawmillState', sawmill => sawmill.update('types', sawmillTypes => sawmillTypes.set(type.id, type)))
    .update('functionSignatures', allSignatures => allSignatures.merge(signatures))
    .update('valueTokens', valueTokens => valueTokens.set(token.identifier, token))
};

const variableDeclarator = (state, declarator) => {
  switch (declarator.init.type) {
    default:
      return state;
    case 'ArrowFunctionExpression':
      return functionDeclarator(state, declarator, declarator.init);
  }
};

const variableDeclaration = (state, variableNode) => {
  return variableNode.declarations.reduce((state, declaratorNode) => {
    return variableDeclarator(state, declaratorNode);
  }, state);
};

const getLiteralValue = (state, literalDeclaration) => {
  const literalValue = literalDeclaration.value;

  if (typeof literalValue !== 'number') {
    throw new Error(`There's no known type for the type identifier: "${typeof literalDeclaration.value}"`)
  }

  const isLiteralNumber = value => value.type === 'literal-number' && value.value === literalValue;
  const existingLiteralNumber = state.values.find(isLiteralNumber, null, null);

  return existingLiteralNumber !== null ? existingLiteralNumber : createLiteralNumber(literalValue);
};

const returnDeclaration = (state, returnNode) => {
  if (returnNode.argument.type !== 'Literal') {
    console.warn('Unexpected Syntax in return statement; We don\'t support this yet!');
    return state;
  }

  const returnValue = getLiteralValue(state, returnNode.argument);

  const returnSawmillValue = createInstance(returnValue.type.id);

  return state
    .update('values', values => values.set(returnValue.id, returnValue))
    .update('initalSawmillState', sawmillState => sawmillState.update('types', types => types.set(returnValue.type.id ,returnValue.type)))
    .update('statements', statements => statements
      .push(createValue(returnSawmillValue))
      .push(constrain(createConstraint(returnSawmillValue.id, returnSawmillValue.typeId)))
      .push(exit())
    )
    .set('returnValue', returnSawmillValue.id)
};

const statement = (body, initialState)/*: RecordOf<LumberState>*/ => {
  return body.reduce((state, node) => {
    switch (node.type) {
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

const getProgramFromSource = (
  source/*: string*/,
  initialState/*: RecordOf<LumberState>*/ = createLumberState()
) => {
  const estree = parse(source);
  //console.log(JSON.stringify(estree, null, 2));
  //console.log(JSON.stringify(program(estree, initialState), null, 2));
  return statement(estree.body, initialState);
};

module.exports = {
  createLumberState,
  getProgramFromSource,
};