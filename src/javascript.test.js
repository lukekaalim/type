// @flow strict
const { assert } = require('@lukekaalim/test');
const { getProgramFromSource, createJsParserState } = require('./javascript/parser');
const { assertToDo } = require('./assertions.test');
const { createFunctionAnnotation, createTypeAnnotation } = require('./javascript/annotation');
const { createSimpleType } = require('./type');
const { createSourceLocation } = require('./javascript/source');
const { createTypeToken } = require('./javascript/token');
const { getProgramState, createState } = require('./program');
const { Map } = require('immutable');

const testParser = async () => {
  const source = `
  // (Alpha)
  const main = (a) => {
    return 10;
  };
  `;
  const alphaType = createSimpleType();
  const alphaToken = createTypeToken('Alpha', alphaType.id, createSourceLocation(10, 15))

  const parameterAnnotation = createTypeAnnotation(alphaToken.id);
  const mainAnnotation = createFunctionAnnotation(createSourceLocation(0, 16), [parameterAnnotation.id]);

  const numberType = createSimpleType();
  const numberToken = createTypeToken('number', numberType.id, createSourceLocation(0, 0));


  const initialState = createJsParserState({
    annotations: Map([
      [parameterAnnotation.id, parameterAnnotation],
      [mainAnnotation.id, mainAnnotation],
    ]),
    typeTokens: Map([
      [alphaToken.identifier, alphaToken],
      [numberToken.identifier, numberToken]
    ]),
  });
  const initialState2 = {
    ...createState(),
    types: Map([
      [alphaType.id, alphaType],
      [numberType.id, numberType],
    ]),
  }
  const state = getProgramFromSource(source, initialState);
  return assert('Should get a good AST and parse it for errors', [
    assertToDo(JSON.stringify(state.get('program'), null, 2)),
    assertToDo(JSON.stringify(getProgramState(state.get('program'), initialState2), null, 2))
  ]);
};

const testJavascript = async () => {
  return assert('Parser should parse the sourcecode into an estree', [
    await testParser(),
  ]);
};

module.exports = {
  testJavascript,
};
