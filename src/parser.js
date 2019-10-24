// @flow
const { parse } = require("acorn");
const { createSimpleType, createBranchingType } = require('./type');
const { createInstance } = require('./instance');
const { createDeclareTypeStatement, createDeclareInstanceStatement } = require('./statements');

const onNode = (node) => {
  switch (node.type) {
    case 'Program':
      console.log('Declared a program!');
    default:
  }
}

const trueType = createSimpleType('TRUE');
const falseType = createSimpleType('FALSE');
const booleanType = createBranchingType([trueType.id, falseType.id]);

const canonStatements = [
  createDeclareTypeStatement(trueType),
  createDeclareTypeStatement(falseType),
  createDeclareTypeStatement(booleanType),
];

const getCanonType = (identifier) => {
  switch (identifier) {
    default:
      throw new Error();
    case 'boolean':
      return booleanType;
  }
}

const parseArrowFunction = (lengthsAcc, comments, { start, params, body }) => {
  const lineStart = getLine(lengthsAcc, start);
  const [comment] = comments.find(([, line]) => line + 1 === lineStart) || [''];
  const argumentTypes = comment.split(',').map(getCanonType);

  const argumentStatements = params.map(({ name }, index) => (
    createDeclareInstanceStatement(createInstance(argumentTypes[index].id))
  ));

  return argumentStatements;
};

const getLine = (lengthsAcc, charIndex) => {
  return lengthsAcc.findIndex(length => charIndex < length);
}

const parseExpression = (source/*: string*/) => {
  const lines = source.split('\n');
  const lengths = lines.map(line => line.length);
  const lengthsAcc = lengths.reduce((acc, curr, index) => [...acc, (acc[index - 1] || 0) + curr], []);
 
  const comments = [];
  const onComment = (isBlock, comment, start, end) => (
    comments.push([comment, getLine(lengthsAcc, start)])
  );
  const parsed = parse(source, { onComment });

  const [firstProgram] = parsed.body.map(node => {
    const declarator = node.declarations[0];
    const name = declarator.id.name;
    return parseArrowFunction(lengthsAcc, comments, declarator.init);
  });
  
  console.log([...canonStatements, firstProgram]);
};


module.exports = {
  parseExpression,
}