// @flow strict
const { Record } = require('immutable');
const generateUUID = require('uuid/v4');
/*::
import type { TypeID } from './type';
import type { RelationshipID } from './relationship';
import type { InstanceID } from './instance';

export opaque type ConstraintID = string;
// A constraint negates a 'polymorphic variant'
export type Constraint = {
  id: ConstraintID,
  relationship: RelationshipID,
  constrainedVariant: TypeID,
};
*/

const createConstraint = (relationship/*: RelationshipID*/, constrainedVariant/*: TypeID*/)/*: Constraint*/ => ({
  id: generateUUID(),
  relationship,
  constrainedVariant,
});

module.exports = {
  createConstraint,
};
