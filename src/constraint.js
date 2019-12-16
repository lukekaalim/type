// @flow strict
import immutable from 'immutable';

import generateUUID from 'uuid/v4.js';
/*::
import type { TypeID } from './type.js';
import type { VariantRelationshipID } from './relationship.js';
import type { InstanceID } from './instance.js';

export opaque type ConstraintID = string;
// A constraint negates a 'polymorphic variant'
export type Constraint = {
  id: ConstraintID,
  relationshipId: VariantRelationshipID,
  constrainedVariantId: TypeID,
};
*/
const { Record } = immutable;

const createConstraint = (relationshipId/*: VariantRelationshipID*/, constrainedVariantId/*: TypeID*/)/*: Constraint*/ => ({
  id: generateUUID(),
  relationshipId,
  constrainedVariantId,
});

const exported = {
  createConstraint
};

export default exported;
export { createConstraint };
