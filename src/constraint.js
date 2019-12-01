// @flow strict
import immutable from 'immutable';

import generateUUID from 'uuid/v4.js';
/*::
import type { TypeID } from './type.js';
import type { RelationshipID } from './relationship.js';
import type { InstanceID } from './instance.js';

export opaque type ConstraintID = string;
// A constraint negates a 'polymorphic variant'
export type Constraint = {
  id: ConstraintID,
  relationshipId: RelationshipID,
  constrainedVariantId: TypeID,
};
*/
const { Record } = immutable;

const createConstraint = (relationshipId/*: RelationshipID*/, constrainedVariantId/*: TypeID*/)/*: Constraint*/ => ({
  id: generateUUID(),
  relationshipId,
  constrainedVariantId,
});

const exported = {
  createConstraint
};

export default exported;
export { createConstraint };
