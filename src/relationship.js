// @flow strict
import generateUUID from 'uuid/v4.js';

/*::
import type { TypeID } from './type.js';

// The subject type is Variant, in that is can substitute itself
// where the types it is PolymorphicOf would normally be.
type VariantRelationshipID = string;
type VariantRelationship = {
  id: VariantRelationshipID,
  subjectId: TypeID,
  variantOfIds: TypeID[],
};

// The selected type is an *intersection*, that is,
// it is considered to be 'composed' of all of a section of other types
type IntersectionRelationshipID = string;
type IntersectionRelationship = {
  id: IntersectionRelationshipID,
  subjectId: TypeID,
  intersectionOfIds: TypeID[],
};


export type {
  VariantRelationshipID,
  VariantRelationship,
  IntersectionRelationship,
  IntersectionRelationshipID,
};
*/

const createVariantRelationship = (subjectId/*: TypeID*/, variantOfIds/*: TypeID[]*/)/*: VariantRelationship*/ => ({
  id: generateUUID(),
  subjectId,
  variantOfIds,
});

const createIntersectionalRelationship = (subjectId/*: TypeID*/, intersectionOfIds/*: TypeID[]*/)/*: IntersectionRelationship*/ => ({
  id: generateUUID(),
  subjectId,
  intersectionOfIds,
});

export { createVariantRelationship, createIntersectionalRelationship };
