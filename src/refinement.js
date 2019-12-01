// @flow strict
import { UnknownTypeIDError } from './errors.js';

import { createSimpleType } from './type.js';
import { createConstraint } from './constraint.js';
import immutable from 'immutable';
/*::
import type { Type, TypeID } from './type.js';
import type { InstanceID, Instance } from './instance.js';
import type { ProgramState } from './program.js';
import type { Constraint } from './constraint.js';
import type { Token } from './token.js';
import type { VariantRelationship } from './relationship.js';

import type { Map, RecordOf } from 'immutable';
*/

/*::
// A refinement is a _branch_ in how a program understands it's type,
// meaning that is has made certain assumptions about how execution is evolving.
export type Refinement = {
  constraints: List<Constraint>,
};
*/
const { List } = immutable;

const createRefinement = (constraints/*: List<Constraint>*/)/*: Refinement*/ => ({
  constraints,
});

const reduceToFlat = /*:: <T>*/(acc/*: T[]*/, curr/*: T[]*/)/*: T[]*/ => [...acc, ...curr];

const createRefinementsForVariant = (state, relationship, constraints) => {
  const existingConstraint = constraints.find(c => c.relationshipId === relationship.id);
  if (existingConstraint) {
    return createRefinementsForTypeId(state, existingConstraint.constrainedVariantId, constraints);
  }

  return relationship.variantOfIds
    .map(variantId => createRefinementsForTypeId(state, variantId, constraints.push(createConstraint(relationship.id, variantId))))
    .reduce(reduceToFlat, []);
};

const createRefinementForIntersection = (state, relationship, constraints) => {
  let refinements = [createRefinement(constraints)];

  for (const intersectionId of relationship.intersectionOfIds) {
    let newRefinements = [];
    for (const refinement of refinements) {
      newRefinements.push(createRefinementsForTypeId(state, intersectionId, refinement.constraints));
    }
    refinements = newRefinements.reduce(reduceToFlat, []);
  }
  
  return refinements;
};

const createRefinementsForTypeId = (state/*: RecordOf<ProgramState>*/, typeId/*: TypeID*/, constraints/*: List<Constraint>*/)/*: Refinement[]*/ => {
  let refinements = [createRefinement(constraints)];

  const variantRelationship = state.variantRelationships.find(r => r.subjectId === typeId);
  if (variantRelationship) {
    refinements = createRefinementsForVariant(state, variantRelationship, constraints);
  }
  
  const intersectionRelationship = state.intersectionRelationships.find(r => r.subjectId === typeId);
  if (intersectionRelationship) {
    refinements = refinements
      .map(refinement => createRefinementForIntersection(state, intersectionRelationship, refinement.constraints))
      .reduce(reduceToFlat, []);
  }
  
  return refinements;
};

const exported = {
  createRefinementsForTypeId
};

export default exported;
export { createRefinementsForTypeId };
