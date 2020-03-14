// @flow strict
const { CommentParser } = require('./parser.js');
const { assert } = require('@lukekaalim/test');

const sourceCode = `
//@type

// note number;
const myNumber = 10;
`;

const testParser = () => {
  const commentParser = new CommentParser();
  const tree = commentParser.parse(sourceCode);

  console.log(tree);

  return assert('The parser returns an object', typeof tree === 'object');
};

module.exports = {
  testParser,
};
