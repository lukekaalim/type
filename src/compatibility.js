// @flow strict
/*::
import type { Type, TypeID } from './type.js';
import type { Map } from 'immutable';
*/
import { UnimplementedError, UnknownTypeIDError } from './errors.js';

const areTypesCompatible = (
  types/*: Map<TypeID, Type>*/,
  typeAId/*: TypeID*/,
  typeBId/*: TypeID*/,
) => {
  const typeA = types.get(typeAId);
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
      const typeB = types.get(typeBId);
      if (!typeB) {
        throw new UnknownTypeIDError();
      }
      if (typeB.type === 'simple') {
        // If both were simple types, and they were not equal, that's an automatic fail
        return false;
      }
      return areTypesCompatible(types, typeB.id, typeA.id);
    }
    case 'branching':
      return typeA.branches.every(branchId =>
        // Loop though each branch, and if they are all equal, it's compatible
        areTypesCompatible(types, branchId, typeBId)
      );
    case 'implementing':
      return !!typeA.implements.find(implementedId =>
        // Loop through each implementation; if any of them match, it's compatible
        areTypesCompatible(types, implementedId, typeBId)
      )
    default:
      throw new UnimplementedError(`Type Compatibility For ${typeA.type}`);
  }
};

const exported = {
  areTypesCompatible
};

export default exported;
export { areTypesCompatible };
