// @flow strict
const { assert } = require('@lukekaalim/test');
const { getProgramFromSource, createLumberState } = require('./javascript/parser');
const { assertToDo } = require('./assertions.test');
const { createFunctionAnnotation, createTypeAnnotation } = require('./javascript/annotation');
const { createSimpleType } = require('./type');
const { createSourceLocation } = require('./javascript/source');
const { createTypeToken } = require('./javascript/token');
const { createProgram, runProgram, createProgramState } = require('./program');
const { Map } = require('immutable');
const { Console } = require('console');
const { inspect } = require('util');

const deepConsole = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: true,
  inspectOptions: { depth: 10 }
});

const testParser = async () => {
  const source = `
  // (boolean)
  const main = (a) => {
    if (a) {
      return 69;
    }
    return 400;
  };
  `;
  const alphaType = createSimpleType();
  const alphaToken = createTypeToken('Alpha', alphaType.id)

  const parameterAnnotation = createTypeAnnotation(alphaToken.id);
  const mainAnnotation = createFunctionAnnotation(createSourceLocation(0, 16), [parameterAnnotation.id]);

  const numberType = createSimpleType();
  const numberToken = createTypeToken('number', numberType.id);

  const undefinedType = createSimpleType();
  const undefinedToken = createTypeToken('undefined', undefinedType.id);

  const initialLumberState = createLumberState({
    annotations: Map([
      [parameterAnnotation.id, parameterAnnotation],
      [mainAnnotation.id, mainAnnotation],
    ]),
    typeTokens: Map([
      [alphaToken.identifier, alphaToken],
      [numberToken.identifier, numberToken],
      [undefinedToken.identifier, undefinedToken]
    ]),
    initialSawmillState: createProgramState({
      types: Map([
        [alphaType.id, alphaType],
        [numberType.id, numberType],
        [undefinedType.id, undefinedType],
      ]),
    })
  });

  const finalLumberState = getProgramFromSource(source, initialLumberState);
  const finalSawmillStates = runProgram(createProgram({ statements: finalLumberState.statements }), finalLumberState.initialSawmillState);

  const mainToken = finalLumberState.valueTokens.get('main');
  const get = /*:: <T>*/(x/*: ?T*/)/*: T*/ => {
    if (!x)
      throw new Error();
    return x;
  }
  deepConsole.log(finalLumberState.toJS())
  for (const state of finalSawmillStates) {
    deepConsole.log(state.toJS());
    const getIdentifierOfTypeID = typeId => finalLumberState.typeTokens.find(token => token.typeId === typeId).identifier;
    const getTypeIDOfIdentifier = identifier => finalLumberState.typeTokens.find(token => token.identifier === identifier, null).typeId;
    const getValueIDOfIdentifier = identifier => finalLumberState.valueTokens.find(token => token.identifier === identifier, null).valueId;
    const getTypeOfValueID = valueId => get(state.values.get(valueId)).typeId;
    const getSigOfFunction = typeId => get(finalLumberState.functionSignatures.find(x => x.typeId === typeId));
    const getStaticValueOfType = typeId => finalLumberState.staticValues.find(x => x.valueType.id === typeId);
  
    const valueId = getValueIDOfIdentifier('main')
    const typeId = getTypeOfValueID(valueId);
    const sig = getSigOfFunction(typeId);
    const returnValue = getStaticValueOfType(sig.returnType);

    deepConsole.log([...sig.argumentTypes.values()]);
    deepConsole.log(returnValue);
  }

  return assertToDo('todo');
};

const testJavascript = async () => {
  return assert('Parser should parse the sourcecode into an estree', [
    await testParser(),
  ]);
};

module.exports = {
  testJavascript,
};
