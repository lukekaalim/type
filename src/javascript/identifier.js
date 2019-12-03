// @flow strict
import generateUUID from 'uuid/v4';

/*::
export opaque type IdentifierID = string;
export type Identifier = {
  id: IdentifierID,
  value: string,
};
*/

const createIdentifier = (value/*: string*/)/*: Identifier*/ => ({
  id: generateUUID(),
  value,
});

export {
  createIdentifier,
};
