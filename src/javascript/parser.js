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

/*:: 
type JSParserState = {
  annotations: Map<AnnotationID, Annotation>,
  valueTokens: Map<Identifier, ValueToken>,
  typeTokens: Map<Identifier, TypeToken>,
  program: Program,
};
*/
const createJsParserState/*: RecordFactory<JSParserState>*/ = Record({
  annotations: Map(),
  valueTokens: Map(),
  typeTokens: Map(),
  program: createProgram([])
}, 'JSParserState');

const variableDeclarator = (state, declarator) => {
  const instance = createInstance(createSimpleType().id);
  const token = createInstanceToken(declarator.id.name, instance.id, createSourceLocation(declarator.start, declarator.end));
  return state.update('valueTokens', valueTokens => valueTokens.set(token.identifier, token));
};

const variableDeclaration = (state, variableNode) => {
  return variableNode.declarations.reduce((state, declaratorNode) => {
    return variableDeclarator(state, declaratorNode);
  }, state);
};

const program = (programNode, initalState)/*: RecordOf<JSParserState>*/ => {
  return programNode.body.reduce((state, bodyNode) => {
    switch (bodyNode.type) {
      case 'VariableDeclaration':
        return variableDeclaration(state, bodyNode);
    }
    return state;
  }, initalState);
};

const getProgramFromSource = (
  source/*: string*/,
  initalState/*: RecordOf<JSParserState>*/ = createJsParserState()
) => {
  const estree = parse(source);
  console.log(JSON.stringify(estree, null, 2));
  console.log(JSON.stringify(program(estree, initalState), null, 2));
};

module.exports = {
  createJsParserState,
  getProgramFromSource,
};