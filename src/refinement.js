// @flow strict
const { UnknownTypeIDError } = require('./errors');
const { createSimpleType, createImplementingType, createBranchingType } = require('./type');
/*::
import type { Type, TypeID, ImplementingType } from './type';
import type { Token } from './token';

import type { Map } from 'immutable';
import type { State } from './state';
*/

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
};
