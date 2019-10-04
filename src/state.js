// @flow strict
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';

export type State = {
  types: Map<TypeID, Type>,
  tokens: Map<TokenID, Token>,
  tokenTypeMap: Map<TokenID, TypeID>
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
  types: new Map(),
  tokens: new Map(),
  tokenTypeMap: new Map(),
});

module.exports = {
  reduceState,
  createState,
};