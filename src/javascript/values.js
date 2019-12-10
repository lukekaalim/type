// @flow strict
import generateUUID from 'uuid/v4.js';
import immutable from 'immutable';
const { Map, Record, List } = immutable;

import { generateRelationshipsForFunctions, generateTypesForFunctions } from './values/function.js';

import { createSimpleType } from '../type.js';

/*::
import type { JSFunction, JSFunctionID } from './values/function';
import type { JSBoolean, JSBooleanID } from './values/boolean';
import type { JSNumber, JSNumberID } from './values/number';

import type { ECMAScriptPrimitives } from './ecma';
import type { Type } from '../type.js';
import type { RecordFactory, RecordOf } from 'immutable';
import type { VariantRelationship } from '../relationship';

export type JSReference =
  | { type: 'function', id: JSFunctionID }
  | { type: 'boolean', id: JSBooleanID }
  | { type: 'number', id: JSNumberID }

type JSValuesProps = {
  functions: Map<JSFunctionID, JSFunction>,
  booleans: Map<JSBooleanID, JSBoolean>,
  numbers: Map<JSNumberID, JSNumber>,
};

export type JSValues = RecordOf<JSValuesProps>;
*/

const createJsValues/*: RecordFactory<JSValuesProps>*/ = Record({
  functions: Map(),
  booleans: Map(),
  numbers: Map(),
});

const generateTypesForValues = (values/*: JSValues*/)/*: List<Type>*/ => {
  return List()
    .concat(generateTypesForFunctions(values.functions.toList()));
};

const generateRelationshipsForTypes = (primitives/*: ECMAScriptPrimitives*/, values/*: JSValues*/)/*: List<VariantRelationship>*/ => {
  return List()
    .concat(generateRelationshipsForFunctions(primitives.function.id, values.functions.toList()))
};

// TODO: Future spot for optimization
const mergeValues = (initialValue/*: JSValues*/, ...values/*: JSValues[]*/)/*: JSValues*/ => {
  return initialValue
    .update('functions', functions => functions.merge(...values.map(v => v.functions)))
    .update('booleans', booleans => booleans.merge(...values.map(v => v.booleans)))
    .update('numbers', numbers => numbers.merge(...values.map(v => v.numbers)))
};

export { createJsValues, generateTypesForValues, generateRelationshipsForTypes, mergeValues };
export * from './values/function.js';
export * from './values/boolean.js';
export * from './values/number.js';