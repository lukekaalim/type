// @flow strict
const generateUUID = require('uuid/v4');

/*::
import type { TypeID } from '../type';
import type { InstanceID } from '../instance';
import type { SourceLocation } from './source';

export opaque type TokenID: string = string;
export opaque type Identifier: string = string;
export type TypeToken = {
  type: 'type-token',
  id: TokenID,
  typeId: TypeID,
  identifier: Identifier,
  sourceLocation: SourceLocation,
};
export type ValueToken = {
  type: 'value-token',
  id: TokenID,
  valueId: InstanceID,
  identifier: Identifier,
  sourceLocation: SourceLocation,
};

export type Token = 
  | TypeToken
  | ValueToken
*/

const createTypeToken = (
  identifier/*: string*/,
  typeId/*: TypeID*/,
  sourceLocation/*: SourceLocation*/
)/*: TypeToken*/ => ({
  id: generateUUID(),
  identifier,
  typeId,
  type: 'type-token',
  sourceLocation,
});
const createInstanceToken = (
  identifier/*: string*/,
  valueId/*: InstanceID*/,
  sourceLocation/*: SourceLocation*/
)/*: ValueToken*/ => ({
  id: generateUUID(),
  identifier,
  valueId,
  type: 'value-token',
  sourceLocation,
});

const findIdentifier = () => {

};

module.exports = {
  createTypeToken,
  createInstanceToken,
};