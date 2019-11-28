// @flow strict
const generateUUID = require('uuid/v4');

/*::
import type { TypeID } from './type';

opaque type RelationshipID = string;

// The subject type is Variant, in that is can substitute itself
// where the types it is PolymorphicOf would normally be.
type VariantRelationshipID = string;
type VariantRelationship = {
  id: RelationshipID,
  type: 'variant',
  subjectId: TypeID,
  variantOfIds: TypeID[],
};

// The selected type is an *intersection*, that is,
// it is considered to be 'composed' of all of a section of other types
type IntersectionRelationshipID = string;
type IntersectionRelationship = {
  id: RelationshipID,
  type: 'intersection',
  subjectId: TypeID,
  intersectionOfIds: TypeID[],
};

type Relationship =
  | VariantRelationship
  | IntersectionRelationship

export type {
  RelationshipID,
  Relationship,
  VariantRelationshipID,
  VariantRelationship,
  IntersectionRelationship,
  IntersectionRelationshipID,
};
*/

const createVariantRelationship = (subjectId/*: TypeID*/, variantOfIds/*: TypeID[]*/)/*: VariantRelationship*/ => ({
  id: generateUUID(),
  type: 'variant',
  subjectId,
  variantOfIds,
});

const createIntersectionalRelationship = (subjectId/*: TypeID*/, intersectionOfIds/*: TypeID[]*/)/*: IntersectionRelationship*/ => ({
  id: generateUUID(),
  type: 'intersection',
  subjectId,
  intersectionOfIds,
});

module.exports = {
  createVariantRelationship,
  createIntersectionalRelationship,
};
