// @flow strict

/*::
import type { TypeID } from './type';

opaque type RelationshipID = string;

// The subject type is Variant, in that is can substitute itself
// where the types it is PolymorphicOf would normally be.
type VariantRelationship = {
  id: RelationshipID,
  type: 'variant',
  subject: TypeID,
  variantOf: TypeID[],
};

// The selected type is an *intersection*, that is,
// it is considered to be 'composed' of all of a section of other types
type IntersectionRelationship = {
  id: RelationshipID,
  type: 'intersection',
  subject: TypeID,
  intersectionOf: TypeID[],
};

type Relationship =
  | VariantRelationship
  | IntersectionRelationship

export type {
  RelationshipID,
  Relationship,
  VariantRelationship,
  IntersectionRelationship,
}
*/