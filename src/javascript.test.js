// @flow strict
const { assert } = require('@lukekaalim/test');
const { getProgramFromSource } = require('./javascript/parser');
const { assertFromUser } = require('./assertions.test');

const testParser = async () => {
  const source = `
  //! (a: boolean)
  const main = (a) => {
    if (a) {
      return 1;
    }
    return 0;
  };
  `;
  getProgramFromSource(source);
  return await assertFromUser('Does it look like the parser worked?');
};

const testJavascript = async () => {
  return assert('Parser should parse the sourcecode into an estree', [
    await testParser(),
  ]);
};

module.exports = {
  testJavascript,
};
