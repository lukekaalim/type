// @flow strict
const generateUUID = require('uuid/v4');

/*::
import type { TypeID } from './type';
import type { InstanceID } from './instance';

export opaque type TokenID: string = string;
export opaque type Identifier: string = string;
export type TypeToken = {
  type: 'type-token',
  id: TokenID,
  typeId: TypeID,
  identifier: Identifier,
};
export type ValueToken = {
  type: 'value-token',
  id: TokenID,
  valueId: InstanceID,
  identifier: Identifier,
};

export type Token = 
  | TypeToken
  | ValueToken
*/

const createTypeToken = (identifier/*: string*/, typeId/*: TypeID*/)/*: TypeToken*/ => ({
  id: generateUUID(),
  identifier,
  typeId,
  type: 'type-token',
});
const createInstanceToken = (identifier/*: string*/, valueId/*: InstanceID*/)/*: ValueToken*/ => ({
  id: generateUUID(),
  identifier,
  valueId,
  type: 'value-token',
});

module.exports = {
  createTypeToken,
  createInstanceToken,
};