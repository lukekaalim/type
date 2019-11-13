// @flow strict
const { Record } = require('immutable');
const generateUUID = require('uuid/v4');
/*::
import type { TypeID } from './type';
import type { InstanceID } from './instance';

export opaque type ConstraintID = string;
export type Constraint = {
  id: ConstraintID,
  value: InstanceID,
  typeConstraint: TypeID,
};
*/

const createConstraint = (value/*: InstanceID*/, typeConstraint/*: TypeID*/)/*: Constraint*/ => ({
  id: generateUUID(),
  value,
  typeConstraint,
});

module.exports = {
  createConstraint,
};
