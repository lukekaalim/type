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
  relationshipId: RelationshipID,
  constrainedVariantId: TypeID,
};
*/

const createConstraint = (relationshipId/*: RelationshipID*/, constrainedVariantId/*: TypeID*/)/*: Constraint*/ => ({
  id: generateUUID(),
  relationshipId,
  constrainedVariantId,
});

module.exports = {
  createConstraint,
};
