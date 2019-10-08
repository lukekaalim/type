// @flow strict
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';
import type { InstanceID, Instance } from './instance';

export type State = {
  types: Map<TypeID, Type>,
  tokens: Map<TokenID, Token>,
  instances: Map<InstanceID, Instance>,
  tokenInstanceMap: Map<TokenID, InstanceID>,
  instanceTypeMap: Map<InstanceID, TypeID>,
};
*/
const { UnimplementedError } = require('./errors');

const reduceState = (state/*: State*/, statement/*: Statement*/)/*: Array<State>*/ => {
  switch (statement.type) {
    default:
      throw new UnimplementedError('Reduce State');
  }
};

const createState = ()/*: State*/ => ({
  types: new Map(),
  tokens: new Map(),
  instances: new Map(),
  tokenInstanceMap: new Map(),
  instanceTypeMap: new Map(),
});

module.exports = {
  reduceState,
  createState,
};