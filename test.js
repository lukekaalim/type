// @flow strict
const { assert, colorReporter, unicodeReporter } = require('@lukekaalim/test');
const { testJavascript } = require('./src/javascript.test');
const { testRefinement } = require('./src/refinement.test');
const { expectSource } = require('./src/javascript/source.test');
const { expectFunction } = require('./src/javascript/values/function.test');
const { writeFile } = require('fs').promises;

const test = async () => {
  try {
    process.stdout.write('\033c')
    const assertion = assert('@lukekaalim/type should provide a safe typing language', [
      //await testJavascript(),
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

test();