// @flow strict
import lktest from '@lukekaalim/test';
import * as fs from 'fs';
import { parseJavascript } from '../src/javascript.js';

const { readFile } = fs.promises;

const testExample1 = async () => {
  const exampleContents = await readFile('./example/example_1.js', 'utf8');
  const parsedResults = parseJavascript(exampleContents);
  return lktest.assert('It didnt work', false)
};

export {
  testExample1,
};
