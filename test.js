// @flow strict
const { assert, colorReporter, unicodeReporter } = require('@lukekaalim/test');
const { testJavascript } = require('./src/javascript.test');
const { writeFile } = require('fs').promises;

const test = async () => {
  try {
    const assertion = assert('@lukekaalim/type should provide a safe typing language', [
      await testJavascript(),
    ]);
    console.log(colorReporter(assertion));
    await writeFile('./test.log', unicodeReporter(assertion));
  } catch (err) {
    console.error('The tests encountered an uncaught exception');
    console.error(err);
  }
};

test();