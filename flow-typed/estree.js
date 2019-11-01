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
  consequent: EstreeBlockStatement,
  alternate: null | EstreeBlockStatement,
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
  argument: EstreeLiteral,
}

declare type EstreeBlockStatement = {
  type: 'BlockStatement',
  start: number,
  end: number,
  body: (EstreeIfStatement | EstreeReturnStatement)[],
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
  body: EstreeBlockStatement,
}

declare type EstreeVariableDeclarator = {
  type: 'VariableDeclarator',
  start: number,
  end: number,
  id: EstreeIdentifier,
  init: EstreeArrowFunctionExpression,
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
  body: EstreeVariableDeclaration[],
};