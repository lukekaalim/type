// @flow strict
import generateUUID from 'uuid/v4.js';

/*::
import type { TypeID } from './type.js';

type InstanceID = string;
type Instance = {
  id: InstanceID,
  typeId: TypeID,
};

export type {
  InstanceID,
  Instance,
  InstanceID as ValueID,
  Instance as Value,
}
*/

const createInstance = (typeId/*: TypeID*/)/*: Instance*/ => ({
  id: generateUUID(),
  typeId,
});

const createValue = createInstance;

export { createInstance, createValue };
