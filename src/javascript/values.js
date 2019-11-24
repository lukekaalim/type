// @flow strict
const generateUUID = require('uuid/v4');
const { createSimpleType } = require('../type');

/*::
import type { Type } from '../type';

export opaque type JSValueID = string;
export type JSValue =
  | LiteralBooleanValue
  | LiteralNumberValue;

export type LiteralNumberValue = {
  id: JSValueID,
  type: 'literal-number',
  value: number,
  valueType: Type,
};

export type LiteralBooleanValue = {
  id: JSValueID,
  type: 'literal-boolean',
  value: boolean,
  valueType: Type,
};
*/

const createLiteralBoolean = (value/*: boolean*/)/*: LiteralBooleanValue*/ => ({
  id: generateUUID(),
  type: 'literal-boolean',
  value,
  valueType: createSimpleType(),
});

const createLiteralNumber = (value/*: number*/)/*: LiteralNumberValue*/ => ({
  id: generateUUID(),
  type: 'literal-number',
  value,
  valueType: createSimpleType(),
});

module.exports = {
  createLiteralNumber,
  createLiteralBoolean,
};
