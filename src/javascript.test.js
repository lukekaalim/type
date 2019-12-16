// @flow strict
import test from '@lukekaalim/test';
const { assert } = test;

import { assertToDo } from './assertions.test.js';
import { createFunctionAnnotation, createTypeAnnotation } from './javascript/annotation.js';
import { createSimpleType } from './type.js';
import { createSourceLocation } from './javascript/source.js';
import { createTypeToken } from './javascript/token.js';
import immutable from 'immutable';
const { Map } = immutable;
import { Console } from 'console';
import { inspect } from 'util';

const deepConsole = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: true,
  inspectOptions: { depth: 10 }
});

const testParser = async () => {
  const source = `
  // { "type": "function-expression", "parameters": [{ "type": "type-identifier", "identifier": "boolean" }], "returns": null, "throws": null }
  const main = (a) => {
    if (a) {
      return 70;
    }
    return 420;
  };
  `;
  const alphaType = createSimpleType();
  const alphaToken = createTypeToken('Alpha', alphaType.id)

  const numberType = createSimpleType();
  const numberToken = createTypeToken('number', numberType.id);

  const undefinedType = createSimpleType();
  const undefinedToken = createTypeToken('undefined', undefinedType.id);

  const initialLumberState = createLumberState();

  const finalLumberState = getProgramFromSource(source, initialLumberState);
  const finalSawmillStates = runProgram(createProgram({ statements: finalLumberState.statements }), finalLumberState.initialSawmillState);

  deepConsole.log(finalLumberState.toJS());
  return assertToDo(inspect(finalLumberState.valueTokens.toJS(), { colors: true, depth: null }));
};

const testJavascript = async () => {
  return assert('Parser should parse the sourcecode into an estree', [
    await testParser(),
  ]);
};

const exported = {
  testJavascript
};

export default exported;
export { testJavascript };
