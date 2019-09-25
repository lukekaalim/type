// @flow strict
/*::
import type { Type, TypeID } from './type';
import type { State } from './state';
*/
const { memoize } = require('lodash');
const { UnimplementedError } = require('./errors');

class UnknownTypeIDError extends Error {
  constructor() {
    super(`The provided type ID was not in the typemap`);
  }
}

const testIdMatch = (typeAId, typeBId) => typeAId === typeBId;
const testBranchesMatch = (typeMap, typeA, typeBId) => typeA.branches.every(typeABranch =>
  areTypesCompatible(typeMap, typeABranch, typeBId)
);
const testImplementsMatch = (typeMap, typeA, typeBId) => !!typeA.implements.find(
  implementsTypeId => areTypesCompatible(typeMap, implementsTypeId, typeBId)
);

const areTypesCompatible = (
  state/*: State*/,
  typeAId/*: TypeID*/,
  typeBId/*: TypeID*/,
)/*: boolean*/ => {
  const typeA = state.typeMap.get(typeAId);
  const typeB = state.typeMap.get(typeBId);

  if (!typeA || !typeB) {
    throw new UnknownTypeIDError();
  }

  const testTypeAndId = (type, typeId) => {
    switch (type.type) {
      case 'simple':
        return testIdMatch(type.id, typeId);
      case 'branching':
        return testIdMatch(type.id, typeId) || testBranchesMatch(state, type, typeId);
      case 'implementing':
        return testIdMatch(type.id, typeId) || testImplementsMatch(state, type, typeId);
      default:
        throw new UnimplementedError(`Type Compatibility For ${type.type}`);
    }
  };

  switch (typeA.type) {
    case 'simple':
      return testTypeAndId(typeB, typeA.id);
    case 'branching':
      return testTypeAndId(typeB, typeA.id) ||
        typeA.branches.every(typeABranchTypeId => areTypesCompatible(state, typeABranchTypeId, typeB.id));
    case 'implementing':
      return testTypeAndId(typeB, typeA.id) ||
        !!typeA.implements.find(typeAImplementsType => areTypesCompatible(state, typeAImplementsType, typeB.id));
    default:
      throw new UnimplementedError(`Type Compatibility between ${typeA.type} & ${typeB.type}`);
  }
};

module.exports = {
  areTypesCompatible,
};
