// @flow strict
import lktest from '@lukekaalim/test';
const { assert, colorReporter, unicodeReporter } = lktest;

import { testJavascript } from './src/javascript.test.js';
import { testRefinement } from './src/refinement.test.js';
import { expectSource } from './src/javascript/source.test.js';
import { expectFunction } from './src/javascript/jsValues/function.test.js';
import { promises } from 'fs';

const { writeFile } = promises;

const testType = async () => {
  try {
    process.stdout.write('\u001bc')
    const assertion = assert('@lukekaalim/type should provide a safe typing language', [
      await testJavascript(),
      await testRefinement(),
      await expectSource(),
      await expectFunction(),
    ]);
    console.log(colorReporter(assertion));
    await writeFile('./test.log', unicodeReporter(assertion));
  } catch (err) {
    console.error('The tests encountered an uncaught exception');
    console.error(err);
  }
};

testType();