// @flow strict
const { UnknownTypeIDError } = require('./errors');
const { createSimpleType, createImplementingType, createBranchingType } = require('./type');
/*::
import type { Type, TypeID, ImplementingType } from './type';

import type { State } from './state';
export type Refinement = {
  state: State,
  originalType: TypeID,
  refinedType: TypeID,
};
export type Variant<T: Type> = {
  state: State,
  type: T,
};
*/

const generateVariantsFromType = /*::<T: Type>*/(state/*: State*/, type/*: T*/)/*: $ReadOnlyArray<Variant<Type>>*/ => {
  switch (type.type) {
    case 'implementing': {
      const implementingType = type;
      const implementsTypeMap = new Map();
      for (const implementsId of type.implements) {
        // Get each type that this type implements
        const implementsType = state.typeMap.get(implementsId);
        if (!implementsType) {
          throw new UnknownTypeIDError();
        }
        implementsTypeMap.set(implementsType.id, implementsType);
      }

      let variants/*: $ReadOnlyArray<Variant<ImplementingType>>*/ = [{ state, type: implementingType }];

      for (const [implementsTypeId, implementsType] of implementsTypeMap.entries()) {
        const newVariants = [];
        for (const previousVariant of variants) {
          const implementsVariants = generateVariantsFromType(previousVariant.state, implementsType);
          for (const implementsVariant of implementsVariants) {
            const refinedImplementsId = previousVariant.type;
            const newImplementingType = createImplementingType([...refinedImplementsId.implements.filter(a => a !== implementsTypeId), implementsVariant.type.id]);
            const typeMap = new Map(implementsVariant.state.typeMap).set(newImplementingType.id, newImplementingType);
            const newVariant/*: Variant<ImplementingType>*/ = {
              state: {
                ...implementsVariant.state,
                typeMap,
              },
              type: newImplementingType,
            };
            newVariants.push(newVariant);
          }
        }
        variants = newVariants;
      }
      // $FlowFixMe
      return (variants/*: $ReadOnlyArray<Variant<Type>>*/);
    }
    case 'branching': {
      const variants = [];
      // For each branch in program execution
      for (const branchId of type.branches) {
        // Find the literal type this branch represents
        const branchType = state.typeMap.get(branchId);
        if (!branchType) {
          throw new UnknownTypeIDError();
        }
        // get all the variants of each branch
        const branchVariants = generateVariantsFromType(state, branchType);
        // Add each branch's variants directly to variant list
        variants.push(...branchVariants);
      }
      return variants;
    }
    default:
      return [{state, type}];
  }
};

module.exports = {
  generateVariantsFromType,
};
