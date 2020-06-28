// @flow strict
/*:: import type { AcornComment } from 'acorn'; */
const acorn = require("acorn");

const getEstreeProgram = (sourceCode/*: string*/) => {
  const comments = [];
  const config = {
    onComment: comments,
    sourceType: 'module'
  };
  const program = acorn.parse(sourceCode, config);
  return { program, comments};
};

module.exports = {
  getEstreeProgram,
};
