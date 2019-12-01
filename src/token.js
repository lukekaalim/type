// @flow strict
import generateUUID from 'uuid/v4.js';

/*::
import type { TypeID } from './type.js';
import type { InstanceID } from './instance.js';

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

const exported = {
  createTypeToken,
  createInstanceToken
};

export default exported;
export { createTypeToken, createInstanceToken };