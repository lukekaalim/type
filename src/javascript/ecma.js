// @flow strict
/*::
import type { Type, TypeID } from '../type.js';
*/
import { createSimpleType } from '../type.js';

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
export { createEcmaScriptPrimitives };