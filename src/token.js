// @flow strict
const generateUUID = require('uuid/v4');

/*::
import type { TypeID } from './type';
import type { InstanceID } from './instance';

export opaque type TokenID: string = string;
type TypeToken = {
  type: 'type-token',
  id: TokenID,
  typeId: TypeID,
  identifier: string,
};
type InstanceToken = {
  type: 'instance-token',
  id: TokenID,
  instanceId: InstanceID,
  identifier: string,
};

export type Token = 
  | TypeToken
  | InstanceToken
*/

const createTypeToken = (identifier/*: string*/, typeId/*: TypeID*/)/*: TypeToken*/ => ({
  id: generateUUID(),
  identifier,
  typeId,
  type: 'type-token',
});
const createInstanceToken = (identifier/*: string*/, instanceId/*: InstanceID*/)/*: InstanceToken*/ => ({
  id: generateUUID(),
  identifier,
  instanceId,
  type: 'instance-token',
});

module.exports = {
  createTypeToken,
  createInstanceToken,
};