// @flow strict
const { inspect } = require('util');
const { assert } = require('@lukekaalim/test');

const { getJavascriptAnalysis } = require('./javascript');
const annotations = require('./javascript/annotations');

const testJavascriptAnalyser = () => {
  const sourceCode = `
    //@t string
    const a = 'alpha';
    
    const main = () => {
      //@t 1 => true
      //@t 0 => false
      const methodA = (subject) => {
        if (subject) {
          return true;
        } else {
          return false;
        }
      };

      return {
        methodA,
      };
    };
    main();
  `;

  const analysis = getJavascriptAnalysis(sourceCode);

  const main = analysis.variables.find(variable => variable.identifier === 'main');
  const aVar = analysis.variables.find(variable => variable.identifier === 'a');
  const methodA = analysis.variables.find(variable => variable.identifier === 'methodA');

  const methodAAnnotations = analysis
    .annotations
    .variableAnnotations
    .filter(annotation => methodA && annotation.variableIds.includes(methodA.id));

  return assert('JavascriptAnalyser detects various features of the source code', [
    assert(`scope length is 5`, analysis.scopes.length === 5),
    assert(`comments length is 3`, analysis.comments.length === 3),
    assert(`variables length is 3`, analysis.variables.length === 3),
    assert(`main and a are in same scope`, !!main && !!aVar && main.scopeId === aVar.scopeId),
    assert(`methodA and main are not in same scope`, !!methodA && !!main && main.scopeId !== methodA.scopeId),
    assert(`methodA has two annotations`, methodAAnnotations.length === 2),
  ]);
};

module.exports = {
  testJavascriptAnalyser,
};