// @flow strict
import generateUUID from 'uuid/v4';
/*::
import type { JSFunctionID } from './jsValues/function';
import type { JSNumberID } from './jsValues/number';
import type { JSBooleanID } from './jsValues/boolean';
*/
/*::
export opaque type IdentifierID = string;
export type Identifier = {
  id: IdentifierID,
  value: string,
};

export type IdentifierAssignment =
  | { identifierID: IdentifierID, type: 'function', functionId: JSFunctionID }
  | { identifierID: IdentifierID, type: 'number', functionId: JSNumberID }
  | { identifierID: IdentifierID, type: 'boolean', functionId: JSBooleanID }
*/

const createIdentifier = (value/*: string*/)/*: Identifier*/ => ({
  id: generateUUID(),
  value,
});

export {
  createIdentifier,
};
