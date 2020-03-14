// @flow strict
const { testParser } = require('./src2/parser.test.js');
const { assert, colorReporter } = require('@lukekaalim/test');

const test = async () => {
  try {
    process.stdout.write('\u001bc')
    const assertion = assert('@lukekaalim/type should provide a safe typing language', [
      await testParser(),
    ]);
    console.log(colorReporter(assertion));
  } catch (err) {
    console.error('The tests encountered an uncaught exception');
    console.error(err);
  }
};