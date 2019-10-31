// @flow strict

export type EstreeIdentifier = {
  type: 'Identifier',
  start: number,
  end: number,
  name: string,
};

export type EstreeIfStatement = {
  type: 'IfStatement',
  start: number,
  end: number,
  test: EstreeIdentifier,
  consequent: EstreeBlockStatement,
  alternate: null | EstreeBlockStatement,
}

export type EstreeLiteral = {
  type: 'Literal',
  start: number,
  end: number,
  value: mixed,
  raw: string,
};

export type EstreeReturnStatement = {
  type: 'ReturnStatement',
  start: number,
  end: number,
  argument: EstreeLiteral,
}

export type EstreeBlockStatement = {
  type: 'BlockStatement',
  start: number,
  end: number,
  body: (EstreeIfStatement | EstreeReturnStatement)[],
};

export type EstreeArrowFunctionExpression = {
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

export type EstreeVariableDeclarator = {
  type: 'VariableDeclarator',
  start: number,
  end: number,
  id: EstreeIdentifier,
  init: EstreeArrowFunctionExpression,
}

export type EstreeVariableDeclaration = {
  type: 'VariableDeclaration',
  start: number,
  end: number,
  kind: 'const',
  declarations: EstreeVariableDeclarator[],
}

export type EstreeProgram = {
  type: 'Program',
  start: number,
  end: number,
  sourceType: 'script',
  body: EstreeVariableDeclaration[],
};