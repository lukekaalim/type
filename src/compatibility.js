// @flow strict
/*::
import type { Type, TypeID } from './type';
import type { State } from './state';
*/
const { memoize } = require('lodash');
const { UnimplementedError, UnknownTypeIDError } = require('./errors');

const areTypesCompatible = (
  state/*: State*/,
  typeAId/*: TypeID*/,
  typeBId/*: TypeID*/,
) => {
  const typeA = state.typeMap.get(typeAId);
  if (!typeA) {
    throw new UnknownTypeIDError();
  }
  // Equality shortcut
  if (typeAId === typeBId) {
    return true;
  }
  // So now we know that the IDs are not equal
  switch (typeA.type) {
    case 'simple': {
      const typeB = state.typeMap.get(typeBId);
      if (!typeB) {
        throw new UnknownTypeIDError();
      }
      if (typeB.type === 'simple') {
        // If both were simple types, and they were not equal, that's an automatic fail
        return false;
      }
      return areTypesCompatible(state, typeB.id, typeA.id);
    }
    case 'branching':
      return typeA.branches.every(branchId =>
        // Loop though each branch, and if they are all equal, it's compatible
        areTypesCompatible(state, branchId, typeBId)
      );
    case 'implementing':
      return !!typeA.implements.find(implementedId =>
        // Loop through each implementation; if any of them match, it's compatible
        areTypesCompatible(state, implementedId, typeBId)
      )
    default:
      throw new UnimplementedError(`Type Compatibility For ${typeA.type}`);
  }
};

module.exports = {
  areTypesCompatible,
};
