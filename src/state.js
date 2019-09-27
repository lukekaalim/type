// @flow strict
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';
import type { Refinement } from './refinement';

export type State = {
  errors: Array<Error>,
  typeMap: Map<TypeID, Type>,
  tokenMap: Map<TokenID, Token>,
  refinements: Array<Refinement>,
  branches: Array<State>,
}
*/
const { UnimplementedError } = require('./errors');

const reduceState = (state/*: State*/, statement/*: Statement*/) => {
  switch (statement.type) {
    default:
      throw new UnimplementedError('Reduce State');
  }
};

const createState = ()/*: State*/ => ({
  errors: [],
  typeMap: new Map(),
  tokenMap: new Map(),
  branches: [],
  refinements: [],
});

module.exports = {
  reduceState,
  createState,
};