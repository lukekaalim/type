// @flow strict
import test from '@lukekaalim/test';
const { assert } = test;

import immutable from 'immutable';
const { Map } = immutable;
import { createFunction } from './function.js';
import { createSourceLocation } from '../source.js';
import { createTypeToken } from '../token.js';
import { createEcmaScriptPrimitives } from '../ecma.js';
import { createFunctionAnnotation, createTypeAnnotation } from '../annotation.js';
import { assertToDo } from '../../assertions.test.js';
import { inspect } from 'util';

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
  const jsFunction = createFunction(state, expression);
  const signatureCount = jsFunction.signatures.length;
  return assert('Function should generate a signature with a matching type', signatureCount === 1);
};

const exported = {
  expectFunction
};

export default exported;
export { expectFunction };
