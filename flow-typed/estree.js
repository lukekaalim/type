// @flow strict

declare type EstreeIdentifier = {
  type: 'Identifier',
  start: number,
  end: number,
  name: string,
};

declare type EstreeIfStatement = {
  type: 'IfStatement',
  start: number,
  end: number,
  test: EstreeIdentifier,
  consequent: EstreeStatement,
  alternate: null | EstreeStatement,
}

declare type EstreeLiteral = {
  type: 'Literal',
  start: number,
  end: number,
  value: mixed,
  raw: string,
};

declare type EstreeReturnStatement = {
  type: 'ReturnStatement',
  start: number,
  end: number,
  argument: EstreeIdentifier | EstreeLiteral,
}

declare type EstreeBlockStatement = {
  type: 'BlockStatement',
  start: number,
  end: number,
  body: EstreeStatement[],
};

declare type EstreeStatement =
  | EstreeIfStatement
  | EstreeReturnStatement
  | EstreeVariableDeclaration
  | EstreeBlockStatement

declare type EstreeExpression =
  | EstreeLiteralExpression
  | EstreeArrowFunctionExpression

declare type EstreeLiteralExpression = {
  type: 'Literal',
  value: string | boolean | null | number | RegExp,
};

declare type EstreeArrowFunctionExpression = {
  type: 'ArrowFunctionExpression',
  start: number,
  end: number,
  id: null,
  expression: boolean,
  generator: boolean,
  async: boolean,
  params: EstreeIdentifier[],
  body: EstreeStatement,
}

declare type EstreeVariableDeclarator = {
  type: 'VariableDeclarator',
  start: number,
  end: number,
  id: EstreeIdentifier,
  init: EstreeExpression
}

declare type EstreeVariableDeclaration = {
  type: 'VariableDeclaration',
  start: number,
  end: number,
  kind: 'const',
  declarations: EstreeVariableDeclarator[],
}

declare type EstreeProgram = {
  type: 'Program',
  start: number,
  end: number,
  sourceType: 'script',
  body: EstreeStatement[],
};