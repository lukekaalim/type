// @flow strict
/*::
type Statement = InlineStatement | DeclarationStatement;
*/

const tokenizeText = (sourceText)/*: string[]*/ => {
  return sourceText
    .replace(/\s+/, ' ')
    .split(' ')
};

const parseStatement = (sourceText)/*: ?Statement*/ => {
  const [firstToken, ...statementTokens] = tokenizeText(sourceText);
  if (firstToken !== '!')
    return null;
  return parseDeclarationStatement(statementTokens) || parseInlineStatement(statementTokens) || null;
};

/*::
type DeclarationStatement = {
  type: 'declaration',
  expression: Expression,
  identifier: string,
}
*/

const parseDeclarationStatement = (tokens/*: string[]*/)/*: ?DeclarationStatement*/ => {
  const [typeDeclarationToken, identifierToken, equalsToken, ...expressionTokens] = tokens;
  if (typeDeclarationToken !== 'type' || equalsToken !== '=')
    return null;
  const expression = parseExpression(expressionTokens);
  if (!expression)
    return null;
  const identifier = parseIdentifier(identifierToken);
  if (!identifier)
    return null;
  return {
    type: 'declaration',
    expression,
    identifier,
  };
};

/*::
type InlineStatement = {
  type: 'inline',
  expression: Expression,
};
*/

const parseInlineStatement = (tokens/*: string[]*/)/*: ?DeclarationStatement*/ => {

};

/*::
type Expression =
  | NullExpression
  | IdentifierExpression

type NullExpression = {
  type: 'null'
};

type IdentifierExpression = {
  type: 'identifier',
  text: string,
};
*/

const parseExpression = (expressionTokens/*: string[]*/)/*: ?Expression*/ => {
  const [nullToken, terminalToken] = expressionTokens;
  if (nullToken !== 'null' || terminalToken !== ';')
    return null;
  return {
    type: 'null',
  };
};

const parseIdentifier = (identifierToken/*: string*/)/*: ?string*/ => {
  const matched = (/^[a-zA-Z_][a-zA-Z0-9_]*$/).test(identifierToken);
  return matched ? identifierToken : null;
};