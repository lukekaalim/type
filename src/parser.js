// @flow
const { parse } = require("acorn");
const { createSimpleType, createBranchingType } = require('./type');
const { createInstanceToken } = require('./token');
const { createInstance } = require('./instance');
const { createProgram } = require('./program');
const { createDeclareTypeStatement, createDeclareInstanceStatement, createDeclareReturnStatement, createDeclareIfBranchStatement } = require('./statements');
/*::
import type { Token, TokenID } from './token';
import type { Set } from 'immutable';
*/

const getCanonTypeId = (tokens) => (identifier) => {
  const identifiedToken = tokens.find(token => token.identifier === identifier, null, null);
  if (!identifiedToken)
    throw new Error('Unidentified Token');
  if (identifiedToken.type === 'instance-token')
    throw new Error('Recieve Value Token when Expecting Type Token');
  return identifiedToken.typeId;
}

const getTokenFromIdentifier = (identifier, tokens) => {
  const primitiveTokenType = tokens.find(token => token.identifier === identifier, null, null);
  if (!primitiveTokenType)
    throw new Error('Cant get token from unknown identifier');
  return primitiveTokenType;
};

const getTypeIdFromIdentifier = (identifier, tokens) => {
  const token = getTokenFromIdentifier(identifier, tokens);
  if (token.type === 'instance-token')
    throw new Error('Recieve Value Token when Expecting Type Token');
  return token.typeId;
};

const createInstanceFromLiteral = (literalNode, tokens) => {
  const literalType = typeof literalNode.value;
  const primitiveTokenType = tokens.find(token => token.identifier === literalType, null, null);
  if (!primitiveTokenType)
    throw new Error('Cant create instance from unknown type');
  if (primitiveTokenType.type === 'instance-token')
    throw new Error('Recieve Value Token when Expecting Type Token');
  return createInstance(primitiveTokenType.typeId)
}

const createStatementsFromNode = (tokens) => (node) => {
  switch (node.type) {
    case 'IfStatement':
      const consequentStatements = node.consequent.body
        .map(consequentNode => createStatementsFromNode(tokens)(consequentNode))
        .reduce((acc, curr) => [...acc, ...curr], []);
      const testToken = getTokenFromIdentifier(node.test.name, tokens);
      if (testToken.type !== 'instance-token') {
        throw new Error('Recieve Type Token when Expecting Instance Token');
      }
      return [
        createDeclareIfBranchStatement(testToken.instanceId, getTypeIdFromIdentifier('true', tokens), createProgram(consequentStatements))
      ];
    case 'ReturnStatement': {
      const { argument } = node;
      const instance = createInstanceFromLiteral(argument, tokens);
      return [
        createDeclareInstanceStatement(instance),
        createDeclareReturnStatement(instance.id)
      ];
    }
  }
};

const parseArrowFunction = (lengthsAcc, comments, { start, params, body }/*: { params: { name: string }[], start: number, body: any } */, tokens) => {
  const lineStart = getLine(lengthsAcc, start);
  const [comment] = comments.find(([, line]) => line + 1 === lineStart) || [''];
  const argumentTypes = comment.split(',').map(getCanonTypeId(tokens));

  const argumentInstances = params.map((_, index) => createInstance(argumentTypes[index]));
  const argumentStatements = argumentInstances.map(createDeclareInstanceStatement);
  const argumentTokens = params.map(({ name }, index) => createInstanceToken(name, argumentInstances[index].id))

  const bodyStatements = body.body
    .map(createStatementsFromNode(tokens.merge(argumentTokens)))
    .reduce((acc, curr) => [...acc, ...curr], []);

  return createProgram([
    ...argumentStatements,
    ...bodyStatements,
  ]);
};

const getLine = (lengthsAcc, charIndex) => {
  return lengthsAcc.findIndex(length => charIndex < length);
}

const parseExpression = (source/*: string*/, tokens/*: Set<Token>*/) => {
  const lines = source.split('\n');
  const lengths = lines.map(line => line.length);
  const lengthsAcc = lengths.reduce((acc, curr, index) => [...acc, (acc[index - 1] || 0) + curr], []);
 
  const comments = [];
  const onComment = (isBlock, comment, start, end) => (
    comments.push([comment, getLine(lengthsAcc, start)])
  );
  const parsed = parse(source, { onComment });
  console.log(parsed);

  const [firstProgram] = parsed.body.map(node => {
    const declarator = node.declarations[0];
    const name = declarator.id.name;
    return parseArrowFunction(lengthsAcc, comments, declarator.init, tokens);
  });
  return firstProgram;
};

module.exports = {
  parseExpression,
}