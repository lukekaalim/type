// @flow strict

/*::
import type { Statement } from './statements';
import type { State } from './state';

type Program = {
  statements: Array<Statement>,
};
*/
const { reduceState } = require('./state');

const DEFAULT_STATE = {
  errors: [],
  typeMap: new Map(),
  tokenMap: new Map(),
};

const createProgram = (statements/*: Array<Statement>*/) => ({
  statements,
});

const getProgramState = (program/*: Program*/, initialState/*: State*/ = DEFAULT_STATE)/*: State*/ => {
  return program.statements.reduce(reduceState, initialState);
};

module.exports = {
  createProgram,
  getProgramState,
};
