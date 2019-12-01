// @flow strict
import generateUUID from 'uuid/v4.js';

/*::
export opaque type TypeID: string = string;
export type SimpleType = {
  type: 'simple',
  id: TypeID,
}

export type Type =
  | SimpleType
*/

const createSimpleType = ()/*: SimpleType*/ => ({
  type: 'simple',
  id: generateUUID(),
});

const exported = {
  createSimpleType
};

export default exported;
export { createSimpleType };