// @flow strict
const generateUUID = require('uuid/v4');
/*::
import type { TypeID } from './type';
import type { TokenID } from './token';

export opaque type StatementID: string = string;
export type DeclareStatement = {
  id: StatementID,
  type: 'declare-type',
  typeId: TypeID,
  typeTokenId: TokenID,
};

export type Statement =
  | DeclareStatement
*/

const declare = (typeId/*: TypeID*/, typeTokenId/*: TokenID*/)/*: DeclareStatement*/ => ({
  type: 'declare-type',
  id: generateUUID(),
  typeId,
  typeTokenId,
});

const branch = () => ({
  type: 'branch',
  branches: [],
});

module.exports = {
  declare,
};