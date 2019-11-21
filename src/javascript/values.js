// @flow strict
const generateUUID = require('uuid/v4');
const { createSimpleType } = require('../type');

/*::
import type { Type } from '../type';

export opaque type JSValueID = string;
export type JSValue =
  | LiteralNumberValue;

export type LiteralNumberValue = {
  id: JSValueID,
  type: 'literal-number',
  value: number,
  valueType: Type,
};
*/

const createLiteralNumber = (value/*: number*/)/*: LiteralNumberValue*/ => ({
  id: generateUUID(),
  type: 'literal-number',
  value,
  valueType: createSimpleType(),
});

module.exports = {
  createLiteralNumber,
};
