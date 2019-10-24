// @flow strict
const generateUUID = require('uuid/v4');

/*::
export opaque type TypeID: string = string;
export type SimpleType = {
  type: 'simple',
  name: string,
  id: TypeID,
}
export type BranchType = {
  type: 'branching',
  id: TypeID,
  branches: Array<TypeID>,
}
export type ImplementingType = {
  type: 'implementing',
  id: TypeID,
  implements: Array<TypeID>,
}

export type Type =
  | SimpleType
  | BranchType
  | ImplementingType;
*/

const createSimpleType = (name/*: string*/ = 'Unnamed Type')/*: SimpleType*/ => ({
  type: 'simple',
  id: generateUUID(),
  name,
});

const createImplementingType = (implements/*: Array<TypeID>*/)/*: ImplementingType*/ => ({
  type: 'implementing',
  id: generateUUID(),
  implements,
});

const createBranchingType = (branches/*: Array<TypeID>*/)/*: BranchType*/ => ({
  type: 'branching',
  id: generateUUID(),
  branches,
});

module.exports = {
  createSimpleType,
  createBranchingType,
  createImplementingType,
};