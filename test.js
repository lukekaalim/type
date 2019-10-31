// @flow strict
const { assert, colorReporter } = require('@lukekaalim/test');
const { testJavascript } = require('./src/javascript.test');

const test = () => {
  const assertion = assert('@lukekaalim/type should provide a safe typing language', [
    testJavascript(),
  ]);
  console.log(colorReporter(assertion));
};

test();