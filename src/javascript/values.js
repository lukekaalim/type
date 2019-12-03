// @flow strict
import generateUUID from 'uuid/v4.js';
import immutable from 'immutable';
const { Map, Record, List } = immutable;

import { createSimpleType } from '../type.js';
import { generateRelationshipsForFunctions, generateTypesForFunctions } from './jsValues/function.js';

/*::
import type { JSFunction, JSFunctionID } from './jsValues/function';
import type { JSBoolean, JSBooleanID } from './jsValues/boolean';
import type { JSNumber, JSNumberID } from './jsValues/number';

import type { ECMAScriptPrimitives } from './ecma';
import type { Type } from '../type.js';
import type { RecordFactory, RecordOf } from 'immutable';
import type { VariantRelationship } from '../relationship';

export type JSReference =
  | { type: 'function', id: JSFunctionID }
  | { type: 'boolean', id: JSBooleanID }
  | { type: 'number', id: JSNumberID }

export type JSValues = {
  functions: Map<JSFunctionID, JSFunction>,
  booleans: Map<JSBooleanID, JSBoolean>,
  numbers: Map<JSNumberID, JSNumber>,
};
*/

const createJsValues/*: RecordFactory<JSValues>*/ = Record({
  functions: Map(),
  booleans: Map(),
  numbers: Map(),
});

const generateTypesForValues = (values/*: RecordOf<JSValues>*/)/*: List<Type>*/ => {
  return List()
    .concat(generateTypesForFunctions(values.functions.toList()));
};

const generateRelationshipsForTypes = (primitives/*: ECMAScriptPrimitives*/, values/*: RecordOf<JSValues>*/)/*: List<VariantRelationship>*/ => {
  return List()
    .concat(generateRelationshipsForFunctions(primitives.function.id, values.functions.toList()))
};

export { createJsValues, generateTypesForValues, generateRelationshipsForTypes };
