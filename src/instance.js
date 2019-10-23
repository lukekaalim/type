// @flow strict
const generateUUID = require('uuid/v4');

/*::
import type { TypeID } from './type';

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

module.exports = {
  createInstance,
};
