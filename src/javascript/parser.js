// @flow strict
/*::
import type { Identifier, ValueToken, TypeToken } from './token';
import type { Program } from '../program';
import type { RecordFactory, RecordOf } from 'immutable';

*/
const { Record, Map } = require('immutable');
const { parse } = require("acorn");
const { createProgram } = require('../program');
/*:: 
type JSParserState = {
  annotations: Map<Identifier, Annotation>,
  valueTokens: Map<Identifier, ValueToken>,
  typeTokens: Map<Identifier, TypeToken>,
  program: Program,
};
*/
const createJsParserState/*: RecordFactory<JSParserState>*/ = Record({
  valueTokens: Map(),
  typeTokens: Map(),
  program: createProgram([])
}, 'JSParserState');

const variableDeclarator = (state, declarator) => {
  return state;
};

const variableDeclaration = (state, variableNode) => {
  return variableNode.declarations.reduce((state, declaratorNode) => {
    return variableDeclarator(state, declaratorNode);
  }, state);
};

const program = (programNode/*: EstreeProgram*/)/*: RecordOf<JSParserState>*/ => {
  return programNode.body.reduce((state, bodyNode) => {
    switch (bodyNode.type) {
      case 'VariableDeclaration':
        return variableDeclaration(state, bodyNode);
    }
    return state;
  }, createJsParserState());
};

const getProgramFromSource = (source/*: string*/) => {
  const estree = parse(source);
  console.log(JSON.stringify(estree, null, 2));
  console.log(JSON.stringify(program(estree), null, 2));
};

module.exports = {
  createJsParserState,
  getProgramFromSource,
};