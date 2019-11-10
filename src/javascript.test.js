// @flow strict
const { assert } = require('@lukekaalim/test');
const { getProgramFromSource, createJsParserState } = require('./javascript/parser');
const { assertFromUser } = require('./assertions.test');
const { createFunctionAnnotation, createTypeAnnotation } = require('./javascript/annotation');
const { createSimpleType } = require('./type');
const { createSourceLocation } = require('./javascript/source');
const { createTypeToken } = require('./javascript/token');
const { Map } = require('immutable');

const testParser = async () => {
  const source = `
  // (Alpha)
  const main = (a) => {
    return a;
  };
  `;
  const alphaType = createSimpleType();
  const alphaToken = createTypeToken('Alpha', alphaType.id, createSourceLocation(10, 15))

  const paramaterAnnotation = createTypeAnnotation(alphaToken.id);
  const mainAnnotation = createFunctionAnnotation(createSourceLocation(0, 16), [paramaterAnnotation.id]);

  const initalState = createJsParserState({
    annotations: Map([
      [paramaterAnnotation.id, paramaterAnnotation],
      [mainAnnotation.id, mainAnnotation],
    ]),
    typeTokens: Map([
      [alphaToken.identifier, alphaToken]
    ]),
  });
  getProgramFromSource(source, initalState);
  return await assertFromUser('Does it look like the parser worked?');
};

const testJavascript = async () => {
  return assert('Parser should parse the sourcecode into an estree', [
    await testParser(),
  ]);
};

module.exports = {
  testJavascript,
};
