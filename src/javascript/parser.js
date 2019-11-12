// @flow strict
/*::
import type { Identifier, ValueToken, TypeToken } from './token';
import type { Program } from '../program';
import type { AnnotationID, Annotation } from './annotation';
import type { InstanceID, Instance } from '../instance';
import type { RecordFactory, RecordOf } from 'immutable';
*/

const { createSourceLocation } = require('./source');
const { Record, Map } = require('immutable');
const { parse } = require("acorn");
const { createInstanceToken } = require('./token');
const { createInstance } = require('../instance');
const { createSimpleType } = require('../type');
const { createProgram } = require('../program');
const { createDeclareSubProgram, createDeclareReturnStatement, createDeclareInstanceStatement } = require('../statements');

/*:: 
type JSParserState = {
  annotations: Map<AnnotationID, Annotation>,
  valueTokens: Map<string, ValueToken>,
  typeTokens: Map<string, TypeToken>,
  program: Program,
  returnedProgram: boolean,
};
*/
const createJsParserState/*: RecordFactory<JSParserState>*/ = Record({
  annotations: Map(),
  valueTokens: Map(),
  typeTokens: Map(),
  program: createProgram([]),
  returnedProgram: false,
}, 'JSParserState');

const functionDeclarator = (state, declarator, initFunction) => {
  const instance = createInstance(createSimpleType().id);
  const token = createInstanceToken(declarator.id.name, instance.id, createSourceLocation(declarator.start, declarator.end));
  const functionFinalState = bodyElement(initFunction.body.body, state.set('program', createProgram([])));

  const functionProgram = functionFinalState.get('program');
  return state
    .update('valueTokens', valueTokens => valueTokens.set(token.identifier, token))
    .update('program', program => createProgram([...program.statements, createDeclareSubProgram(
      functionProgram,
    )]))
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

const returnDeclaration = (state, returnNode) => {
  if (returnNode.argument.type === 'Identifier') {
    throw new Error('Unexpected Identifier in return statement; We don\'t support this yet!')
  }
  const returnNodeTypeTokenIdentifier = typeof returnNode.argument.value;
  const type = state.get('typeTokens').get(returnNodeTypeTokenIdentifier);
  if (!type) {
    throw new Error(`There's no known type for the type identifier: "${returnNodeTypeTokenIdentifier}"`)
  }
  const returnInstance = createInstance(createSimpleType().id);
  return state
    .update('program', program => createProgram([
      ...program.statements,
      createDeclareInstanceStatement(returnInstance),
      createDeclareReturnStatement(returnInstance.id)
    ]))
    .set('returnedProgram', true);
};

const bodyElement = (body, initialState)/*: RecordOf<JSParserState>*/ => {
  return body.reduce((state, bodyNode) => {
    if (state.get('returnedProgram')) {
      return state;
    }
    switch (bodyNode.type) {
      case 'VariableDeclaration':
        return variableDeclaration(state, bodyNode);
      case 'ReturnStatement':
        return returnDeclaration(state, bodyNode);
    }
    return state;
  }, initialState);
};

const getProgramFromSource = (
  source/*: string*/,
  initialState/*: RecordOf<JSParserState>*/ = createJsParserState()
) => {
  const estree = parse(source);
  //console.log(JSON.stringify(estree, null, 2));
  //console.log(JSON.stringify(program(estree, initialState), null, 2));
  return bodyElement(estree.body, initialState);
};

module.exports = {
  createJsParserState,
  getProgramFromSource,
};