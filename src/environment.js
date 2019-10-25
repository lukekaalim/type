// @flow strict
/*::
import type { Type, TypeID } from './type';
import type { Token, TokenID } from './token';
*/
const { createTypeToken, createInstanceToken } = require('./token');
const { createSimpleType, createBranchingType } = require('./type');
const { createDeclareTypeStatement } = require('./statements');
const { createState } = require('./program');
const { Map } = require('immutable');

const createBasicJavascriptEnvironment = () => {
  const trueType = createSimpleType();
  const falseType = createSimpleType();
  const booleanType = createBranchingType([trueType.id, falseType.id]);
  const numberType = createSimpleType();

  const types/*: Map<TypeID, Type>*/ = Map([
    numberType,
    trueType,
    falseType,
    booleanType,
  ].map(type => [type.id, type]));

  const trueToken = createTypeToken('true', trueType.id);
  const falseToken = createTypeToken('false', falseType.id);
  const booleanToken = createTypeToken('boolean', booleanType.id);
  const numberToken = createTypeToken('number', numberType.id);

  const tokens/*: Map<TokenID, Token>*/ = Map([
    trueToken,
    falseToken,
    booleanToken,
    numberToken,
  ].map(token => [token.id, token]));

  const initalState = {
    ...createState(),
    types,
  }

  return {
    initalState,
    tokens,
  }
};

module.exports = {
  createBasicJavascriptEnvironment,
}