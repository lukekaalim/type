// @flow strict
/*::
import type { Type, TypeID } from '../type.js';
import type { TypeToken } from './token.js';
*/
import { createSimpleType } from '../type.js';
import { createTypeToken } from './token.js';
import immutable from 'immutable';

/*::
type ECMAScriptPrimitives = {
  number: Type,
  boolean: Type,
  string: Type,
  function: Type,
  object: Type,
  undefined: Type,
  null: Type,
};
*/

const createTypeTokensForPrimitives = (primitives/*: ECMAScriptPrimitives*/)/*: immutable.Map<string, TypeToken>*/ => {
  return immutable.Map([
    ['number', createTypeToken('number', primitives.number.id)],
    ['boolean', createTypeToken('boolean', primitives.boolean.id)],
    ['string', createTypeToken('string', primitives.string.id)],
    ['function', createTypeToken('function', primitives.function.id)],
    ['object', createTypeToken('object', primitives.object.id)],
    ['undefined', createTypeToken('undefined', primitives.undefined.id)],
    ['null', createTypeToken('null', primitives.null.id)],
  ]);
};

const createEcmaScriptPrimitives = ()/*: ECMAScriptPrimitives*/ => {
  const numberType = createSimpleType();
  const booleanType = createSimpleType();
  const stringType = createSimpleType();
  const functionType = createSimpleType();
  const objectType = createSimpleType();
  const undefinedType = createSimpleType();
  const nullType = createSimpleType();

  return {
    number: numberType,
    boolean: booleanType,
    string: stringType,
    function: functionType,
    object: objectType,
    undefined: undefinedType,
    null: nullType,
  };
};

const exported = {
  createEcmaScriptPrimitives
};

/*::
export type {
  ECMAScriptPrimitives,
};
*/

export default exported;
export { createEcmaScriptPrimitives, createTypeTokensForPrimitives };