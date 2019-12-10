// @flow strict
import generateUUID from 'uuid/v4.js';

import { createSimpleType } from '../../type.js';
import { createVariantRelationship } from '../../relationship';
/*::
import type { Type, TypeID } from '../../type';
import type { List } from 'immutable';
*/
/*::
type JSNumberID = string;
type JSNumber = {
  id: JSNumberID,
  type: Type,
  value: number,
};

export type {
  JSNumber,
  JSNumberID,
};
*/

const parseNumberExpression = (
  numberExpression/*: EstreeLiteral*/,
  numberValue/*: number*/,
)/*: JSNumber*/ => {
  return {
    id: generateUUID(),
    type: createSimpleType(),
    value: numberValue
  }
};

const generateRelationshipsForNumbers = (numberTypeId/*: TypeID*/, numbers/*: List<JSNumber>*/) => {
  return [createVariantRelationship(numberTypeId, numbers.map(num => num.type.id).toArray())];
};

const generateTypesForNumbers = (functions/*: List<JSNumber>*/) => {
  return functions
    .map(func => func.type);
};

export {
  parseNumberExpression,
  generateTypesForNumbers,
  generateRelationshipsForNumbers,
};
