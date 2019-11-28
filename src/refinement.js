// @flow strict
const { UnknownTypeIDError } = require('./errors');
const { createSimpleType, createImplementingType, createBranchingType } = require('./type');
const { createConstraint } = require('./constraint');
const { List } = require('immutable');
/*::
import type { Type, TypeID, ImplementingType } from './type';
import type { InstanceID, Instance } from './instance';
import type { ProgramState } from './program';
import type { Constraint } from './constraint';
import type { Token } from './token';
import type { VariantRelationship } from './relationship';

import type { Map, RecordOf } from 'immutable';
*/

/*::
// A refinement is a _branch_ in how a program understands it's type,
// meaning that is has made certain assumptions about how execution is evolving.
export type Refinement = {
  constraints: Constraint[],
};

export type State = {

}
*/

const createRefinement = (constraints/*: Constraint[]*/)/*: Refinement*/ => ({
  constraints,
});

const reduceToFlat = /*:: <T>*/(acc/*: T[]*/, curr/*: T[]*/)/*: T[]*/ => [...acc, ...curr];

const createRefinementsForVariant = (state, relationship, constraints) => {
  const existingConstraint = constraints.find(c => c.relationshipId === relationship.id);
  if (existingConstraint) {
    return createRefinements(state, existingConstraint.constrainedVariantId, constraints);
  }

  return relationship.variantOfId
    .map(variantId => createRefinements(state, variantId, constraints.push(createConstraint(relationship.id, variantId))))
    .reduce(reduceToFlat, []);
};

const createRefinementForIntersection = (state, relationship, constraints): Refinement[] => {
  relationship.intersectionOf
    .reduce(intersectionId => createRefinements(state, intersectionId, constraints))

};

const createRefinements = (state: ProgramState, typeId: TypeID, constraints: List<Constraint>)/*: Refinement[]*/ => {
  let refinements = [createRefinement(constraints.toArray())];

  const variantRelationship = state.variantRelationships.find(r => r.subject === typeId, null, null);
  if (variantRelationship) {
    refinements = createRefinementsForVariant(state, variantRelationship, constraints);
  }
  
  const intersectionRelationship = state.intersectionRelationships.find(r => r.subject === typeId);
  if (intersectionRelationship) {
    refinements = refinements
      .map(refinement => createRefinementForIntersection(state, intersectionRelationship, refinement.constraints))
      .reduce(reduceToFlat, []);
  }
  
  return refinements;
};

const generateConstraintsForPolymorphicRelationships = (
  state/*: RecordOf<ProgramState>*/,
  currentValue/*: InstanceID*/,
  typeId/*: TypeID*/,
  existingConstraints/*: Constraint[]*/,
)/*: Constraint[][]*/ => {
  const variantRelationship = state.relationships.findLast(relationship => relationship.type === 'variant' && relationship.subject === typeId);
  if (!variantRelationship)
    return [existingConstraints];

  if (variantRelationship.type !== 'variant')
    throw new Error();

  const currentRelationshipConstraint = existingConstraints.find(constraint => constraint.relationship === variantRelationship.id);
  if (currentRelationshipConstraint) {
    return generateConstraints(state, currentValue, currentRelationshipConstraint.constrainedVariant, existingConstraints);
  }

  const variantConstraints = variantRelationship.variantOf.map(variantTarget => {
    const constrainedVariant = createConstraint(variantRelationship.id, variantTarget);
    return generateConstraints(state, currentValue, variantTarget, [...existingConstraints, constrainedVariant]);
  });

  return flatten(variantConstraints);
};

const generateConstraintsForIntersectionRelationships = (
  state/*: RecordOf<ProgramState>*/,
  currentValue/*: InstanceID*/,
  typeId/*: TypeID*/,
  existingConstraints/*: Constraint[]*/,
)/*: Constraint[][]*/ => {
  const intersectionalRelationship = state.relationships.findLast(relationship => relationship.type === 'intersection' && relationship.subject === typeId);
  if (!intersectionalRelationship)
    return [existingConstraints];

  if (intersectionalRelationship.type !== 'intersection')
    throw new Error();

  const intersectionConstraintGenerators = intersectionalRelationship.intersectionOf.map(intersectedType =>
    (constraints/*: Constraint[][]*/) => constraints.map(a => generateConstraints(state, currentValue, intersectedType, a))
  );

  const variantConstraints = intersectionConstraintGenerators.reduce((acc, curr) => flatten(curr(acc)), [existingConstraints]);

  return variantConstraints;
};

const flatten = /*:: <T>*/(list/*: T[][]*/)/*: T[]*/ => list.reduce((acc, curr) => [...acc, ...curr], []);

const generateConstraints = (
  state/*: RecordOf<ProgramState>*/,
  currentValue/*: InstanceID*/,
  typeId/*: TypeID*/,
  existingConstraints/*: Constraint[]*/,
)/*: Constraint[][]*/ => {
  const variantConstraints = [
    refinements => refinements.map(constraints => generateConstraintsForPolymorphicRelationships(state, currentValue, typeId, constraints)),
    refinements => refinements.map(constraints => generateConstraintsForIntersectionRelationships(state, currentValue, typeId, constraints))
  ].reduce((acc, curr) => flatten(curr(acc)), [existingConstraints])
  
  return variantConstraints;
};

// SHould create new types and add them to the state

const generateVariantsFromType = (types/*: Map<TypeID, Type>*/, typeId/*: TypeID*/)/*: Array<[Map<TypeID, Type>, TypeID]>*/ => {
  const type = types.get(typeId);
  if (!type)
    throw new Error();
  switch (type.type) {
    case 'implementing': {
      // For each type we implement, generate a set of variants
      const variants = type.implements.reduce((variants, implementsId) => {
        // For each successive set of variants for each type we implement
        const newVariants = variants.map(([variantState, variantType]) => {
          // generate some new variants based off the current type we implement
          const variantsOfImplementedType = generateVariantsFromType(variantState, implementsId);
          // Duplicate the current implementing type, once for each variant
          const newVariantsForImplementedType = variantsOfImplementedType.map(([newTypesWithVariant, newVariantId]) => {
            const newVariantType = createImplementingType([...variantType.implements.filter(id => id !== implementsId), newVariantId]);
            const newVariantState = newTypesWithVariant.set(newVariantType.id, newVariantType);
            return [newVariantState, newVariantType];
          });
          return newVariantsForImplementedType;
        });
        // Flatten the list of lists+
        // We should now just have a list of ImplementingTypes, each represeting a variant any configuration of
        // variants that the implementing type has
        return newVariants.reduce((acc, curr) => [...acc, ...curr], []);
      }, [[types, type]]);

      return variants.map(([state, type]) => [state, type.id]);
    }
    case 'branching': {
      // For each potential type we _could_ be, generate a new variant
      const newVariants = type.branches.map(branch => {
        return generateVariantsFromType(types, branch);
      });
      return newVariants.reduce((acc, curr) => [...acc, ...curr], []);
    }
    default:
      // If we're simple and don't really any possibilities of being anything else
      // return what we were given
      return [[types, type.id]];
  }
};

module.exports = {
  generateVariantsFromType,
  generateConstraints,
};
