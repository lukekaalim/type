// @flow strict
import generateUUID from 'uuid/v4.js';

/*::
import type { TypeID } from './type.js';

export type InstanceID = string;
export type Instance = {
  id: InstanceID,
  typeId: TypeID,
};
*/

const createInstance = (typeId/*: TypeID*/)/*: Instance*/ => ({
  id: generateUUID(),
  typeId,
});

const exported = {
  createInstance
};

export default exported;
export { createInstance };
