// @flow strict
const { getEstreeProgram } = require('./javascript/tree');
const { getScopes } = require('./javascript/scope');
const { getVariables } = require('./javascript/variables');
const { getAnnotations } = require('./javascript/annotations');

const getJavascriptAnalysis = (sourceCode/*: string*/) => {
  const { program, comments } = getEstreeProgram(sourceCode);
  const scopes = getScopes(program);
  const variables = getVariables(scopes);
  const annotations = getAnnotations(scopes, comments, variables);

  return {
    program,
    comments,
    scopes,
    variables,
    annotations,
  };
};

module.exports = {
  getJavascriptAnalysis,
};
