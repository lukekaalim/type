// @flow strict
const { Parser } = require('acorn');

class CommentParser extends Parser {
  skipSpace() {

  }
  skipBlockComment() {

  }
  skipLineComment() {
    
  }
}

module.exports = {
  CommentParser,
};