// @flow strict
import generateUUID from 'uuid/v4.js';

import { createSimpleType } from '../type.js';

/*::
import type { Type } from '../type.js';

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

const exported = {
  createLiteralNumber,
  createLiteralBoolean
};

export default exported;
export { createLiteralNumber, createLiteralBoolean };
