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

const deepConsole = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: true,
  inspectOptions: { depth: 10 }
});

const testParser = async () => {
  const source = `
  // (Alpha)
  const main = (a) => {
    return 10;
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

  const initalLumberState = createLumberState({
    annotations: Map([
      [parameterAnnotation.id, parameterAnnotation],
      [mainAnnotation.id, mainAnnotation],
    ]),
    typeTokens: Map([
      [alphaToken.identifier, alphaToken],
      [numberToken.identifier, numberToken],
      [undefinedToken.identifier, undefinedToken]
    ]),
  });
  const initalSawmillState = createProgramState({
    types: Map([
      [alphaType.id, alphaType],
      [numberType.id, numberType],
      [undefinedType.id, undefinedType],
    ]),
  });

  const finalLumberState = getProgramFromSource(source, initalLumberState);
  const finalSawmillStates = runProgram(createProgram({ statements: finalLumberState.statements }), finalLumberState.initalSawmillState);

  const mainToken = finalLumberState.valueTokens.get('main');
  console.log('token(main) ===', mainToken);
  if (!mainToken)
    throw new Error();
  for (const finalSawmillState of finalSawmillStates) {
    const mainValue = finalSawmillState.values.get(mainToken.valueId);
    console.log('value(main) ===', mainValue);
    if (!mainValue)
      throw new Error();
    const mainConstraint = finalSawmillState.constraints.findLast(constraint => constraint.value === mainValue.id);
    console.log('constraint(main) ===', mainConstraint);
    if (!mainConstraint)
      throw new Error();
    const mainType = finalSawmillState.types.get(mainConstraint.typeConstraint);
    console.log('type(main) ===', mainType)
    if (!mainType)
      throw new Error();
    // Here we assume that main is a function, and thus has a sig
    const sigs = finalLumberState.functionSignatures.filter(sig => sig.typeId === mainType.id);
    console.log('sigs(main) ===', sigs.toJS())
  }

  return assert('Should get a good AST and parse it for errors', false);
};

const testJavascript = async () => {
  return assert('Parser should parse the sourcecode into an estree', [
    await testParser(),
  ]);
};

module.exports = {
  testJavascript,
};
