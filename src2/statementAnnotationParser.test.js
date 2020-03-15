// @flow strict
const { ParserWithStatementAnnotations } = require('./statementAnnotationParser.js');
const { assert } = require('@lukekaalim/test');

const assertIsEqual = (
  actualValue,
  expectedValue,
  actualName = JSON.stringify(actualValue),
  expectedName = JSON.stringify(expectedValue)
) => assert(
  `${actualName} equals the expected ${expectedName}`,
  actualValue === expectedValue
);

const assertExists = (valueToExist, valueName = JSON.stringify(valueToExist) || 'undefined') => assert(
  `${valueName} is not undefined or null`,
  valueToExist !== null && valueToExist !== undefined
);

const createLineComment = (commentContent) => `//${commentContent}`; 

const testAnnotationDetection = () => {
  const myNumberDeclarationStatement = 'const myNumber = 10';
  const myNumberAnnorationStatement = 'note number';

  const sourceCode = [
    createLineComment(myNumberAnnorationStatement),
    myNumberDeclarationStatement,
  ].join('\n');

  const tree = ParserWithStatementAnnotations.parse(sourceCode);

  const declarationNode = tree.body.find(statement => statement.type === 'VariableDeclaration');
  const [declarationAnnotation] = declarationNode ? tree.commentElementMap.get(declarationNode) || [] : [];

  return assert(`The parser can associate a comment with a variable declaration in source code:\n${sourceCode}`, [
    assertExists(declarationNode, 'parsed declaration'),
    assertExists(declarationAnnotation, 'first comment of the variable node'),
    assertIsEqual(declarationAnnotation, myNumberAnnorationStatement, 'parsed comment', 'comment from source code'),
  ]);
};

const testParser = () => {
  return assert('The Statement Annotation Parser can supply statements with annotation information from comments in the source code', [
    testAnnotationDetection(),
  ]);
};

module.exports = {
  testParser,
};
