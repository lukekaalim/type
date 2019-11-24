// @flow strict
/*::
import type { Type, TypeID } from '../type';
*/
const { createSimpleType } = require('../type');
/*::
type ECMAScriptPrimitives = {
  number: Type,
  boolean: Type,
  string: Type,
  function: Type,
  object: Type,
};
*/

const createEcmaScriptPrimitives = ()/*: ECMAScriptPrimitives*/ => {
  const numberType = createSimpleType();
  const booleanType = createSimpleType();
  const stringType = createSimpleType();
  const functionType = createSimpleType();
  const objectType = createSimpleType();

  return {
    number: numberType,
    boolean: booleanType,
    string: stringType,
    function: functionType,
    object: objectType,
  };
};

module.exports = {
  createEcmaScriptPrimitives,
}

/*::
export type {
  ECMAScriptPrimitives,
};
*/