// @flow strict
import generateUUID from 'uuid/v4.js';
/*::
import type { ValueID } from '../instance';
import type { TypeID } from '../type';
*/

/*::
type LinkID = string;
type Link = {
  id: LinkID,
  valueId: ValueID,
  typeId: TypeID,
}

export type {
  Link,
  LinkID,
};
*/

const createLink = (valueId/*: ValueID*/, typeId/*: TypeID*/)/*: Link*/ => ({
  id: generateUUID(),
  valueId,
  typeId,
});

export {
  createLink,
};
