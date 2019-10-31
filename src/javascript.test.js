// @flow strict
const { assert } = require('@lukekaalim/test');
const { getProgramFromSource } = require('./javascript/parser');

const testParser = () => {
  const source = `
  // boolean
  const main = (a) => {
    if (a) {
      return 1;
    }
    return 0;
  };
  `;
  getProgramFromSource(source);
  return assert('Console Log', true);
};

const testJavascript = () => {
  return assert('Parser should parse the sourcecode into an estree', [
    testParser(),
  ]);
};

module.exports = {
  testJavascript,
};
