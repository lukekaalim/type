// @flow strict
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';

export type State = {
  errors: Array<Error>,
  typeMap: Map<TypeID, Type>,
  tokens: Set<Token>,
  tokenMap: Map<TokenID, TypeID>,
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
  tokens: new Set(),
  branches: [],
  refinements: [],
});

module.exports = {
  reduceState,
  createState,
};