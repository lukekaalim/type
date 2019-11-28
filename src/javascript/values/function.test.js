// @flow strict
const { assert } = require('@lukekaalim/test');
const { Map } = require('immutable');
const { parseArrowFunctionExpression } = require('./function');
const { createLumberState } = require('../parser');
const { createSourceLocation } = require('../source');
const { createTypeToken } = require('../token');
const { createEcmaScriptPrimitives } = require('../ecma');

const { createFunctionAnnotation, createTypeAnnotation } = require('../annotation');
const { assertToDo } = require('../../assertions.test');
const { inspect } = require('util');

const expectFunction = () => {
  const primitives = createEcmaScriptPrimitives();

  const sourceCode = '01234\n6789';
  const typeAnnotation = createTypeAnnotation('boolean');
  const functionAnnotation = createFunctionAnnotation([typeAnnotation], null, null);

  const annotations = Map([[createSourceLocation(0, 4), functionAnnotation]]);
  const typeTokens = Map([['boolean', createTypeToken('boolean', primitives.boolean.id)]]);

  const state = createLumberState({
    sourceCode,
    annotations,
    typeTokens,
    primitives,
  });

  const expression = {
    type: 'ArrowFunctionExpression',
    start: 6,
    end: 9,
    id: null,
    expression: true,
    generator: false,
    async: false,
    params: [{
      type: 'Identifier',
      start: 6,
      end: 7,
      name: 'alpha',
    }],
    body: {
      type: 'BlockStatement',
      start: 6,
      end: 9,
      body: [],
    },
  };
  return assertToDo(inspect(parseArrowFunctionExpression(state, expression).toJS(), { color: true, depth: null }));
};

module.exports = {
  expectFunction,
};
