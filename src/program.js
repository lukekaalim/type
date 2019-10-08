// @flow strict

/*::
import type { Statement } from './statements';
import type { State } from './state';

type Program = {
  statements: Array<Statement>,
};
*/
const { reduceState, createState } = require('./state');

const DEFAULT_STATE = createState();

const createProgram = (statements/*: Array<Statement>*/) => ({
  statements,
});

const getProgramState = (program/*: Program*/, initialState/*: State*/ = DEFAULT_STATE) => {
  return program.statements.reduce(reduceState, [initialState]);
};

module.exports = {
  createProgram,
  getProgramState,
};
