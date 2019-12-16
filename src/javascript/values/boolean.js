// @flow strict
import generateUUID from 'uuid/v4.js';

import { createSimpleType } from '../../type.js';
import { createVariantRelationship } from '../../relationship.js';
/*::
import type { Type, TypeID } from '../../type';
import type { List } from 'immutable';
*/
/*::
type JSBooleanID = string;
type JSBoolean = {
  id: JSBooleanID,
  type: Type,
  value: boolean,
};

export type {
  JSBoolean,
  JSBooleanID,
};
*/

const parseBooleanExpression = (
  booleanExpression/*: EstreeLiteral*/,
  booleanValue/*: boolean*/,
)/*: JSBoolean*/ => {
  return {
    id: generateUUID(),
    type: createSimpleType(),
    value: booleanValue
  }
};

const generateRelationshipsForBooleans = (booleanTypeId/*: TypeID*/, booleans/*: List<JSBoolean>*/) => {
  return [createVariantRelationship(booleanTypeId, booleans.map(bool => bool.type.id).toArray())];
};

const generateTypesForBooleans = (functions/*: List<JSBoolean>*/) => {
  return functions
    .map(func => func.type);
};

export {
  parseBooleanExpression,
  generateTypesForBooleans,
  generateRelationshipsForBooleans,
};
