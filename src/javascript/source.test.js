// @flow strict
import { getLineFromIndex } from './source.js';

import test from '@lukekaalim/test';
const { assert } = test;
import { assertEqual } from '../assertions.test.js';

const expectLinesFromIndex = () => {
  const source =
    `This is the first line of some source code.
    This is the second line.
    This is the final line.`;
  
  const secondIndex = source.indexOf('second');

  return assert('expectLinesFromIndex should find the line of source code from a character index', [
    assert('Very first index should be line zero', [assertEqual(getLineFromIndex(source, 0), 0)]),
    assert('Line with the word second should be line one', [assertEqual(getLineFromIndex(source, secondIndex), 1)]),
    assert('Very final index should be line two', [assertEqual(getLineFromIndex(source, source.length - 1), 2)]),
  ]);
};

const expectSource = () => {
  return assert('The Source module should be able to determine facts and locations of source nodes', [
    expectLinesFromIndex(),
  ]);
};

const exported = {
  expectSource
};

export default exported;
export { expectSource };
