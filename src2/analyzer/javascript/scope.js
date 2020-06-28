// @flow strict
const uuid = require('uuid/v4.js');
/*::
export opaque type ScopeID: string = string;
export type Scope = {
  parentId: null | ScopeID,
  id: ScopeID,
  source:
    | { type: 'program', program: EstreeProgram }
    | { type: 'block', block: EstreeBlockStatement }
};
*/

const getScopesFromBlockStatement = (parentScope, block)/*: Scope[]*/ => {
  const blockScope/*: Scope*/ = {
    id: uuid(),
    parentId: parentScope.id,
    source: { type: 'block', block }
  };
  const bodyScopes/*: Scope[]*/ = block
    .body
    .map(statement => getScopesFromStatement(blockScope, statement))
    .flat(1);
  return [...bodyScopes, blockScope];
}

const getScopesFromIfStatement = (parentScope, ifStatement)/*: Scope[]*/ => {
  const { alternate, consequent } = ifStatement;
  if (alternate !== null) {
    return [
      ...getScopesFromStatement(parentScope, consequent),
      ...getScopesFromStatement(parentScope, alternate),
    ];
  } else {
    return getScopesFromStatement(parentScope, consequent);
  }
};

const getScopesFromArrowFunctionExpression = (parentScope, arrowFunction) => {
  return getScopesFromStatement(parentScope, arrowFunction.body);
}

const getScopesFromExpression = (parentScope, expression/*: EstreeExpression*/) => {
  switch (expression.type) {
    case 'ArrowFunctionExpression':
      return getScopesFromArrowFunctionExpression(parentScope, expression);
    default:
      return [];
  }
};

const getScopesFromVariableDeclaration = (parentScope, declaration)/*: Scope[]*/ => {
  const declarationScopes = declaration
    .declarations
    .map(declarator => getScopesFromExpression(parentScope, declarator.init))
    .flat(1);
  return declarationScopes;
}

const getScopesFromStatement = (parentScope, statement) => {
  switch (statement.type) {
    case 'BlockStatement':
      return getScopesFromBlockStatement(parentScope, statement);
    case 'VariableDeclaration':
      return getScopesFromVariableDeclaration(parentScope, statement);
    case 'IfStatement':
      return getScopesFromIfStatement(parentScope, statement);
    default:
      return [];
  }
};

const getScopes = (program/*: EstreeProgram*/)/*: Scope[]*/ => {
  const programScope/*: Scope*/ = {
    parentId: null,
    id: uuid(),
    source: { type: 'program', program },
  };
  const bodyScopes = program
    .body
    .map(statement => getScopesFromStatement(programScope, statement))
    .flat(1);
  return [...bodyScopes, programScope];
};

const getScopeStatements = (scope/*: Scope*/) => {
  switch (scope.source.type) {
    case 'program':
      return scope.source.program.body;
    case 'block':
      return scope.source.block.body;
    default:
      throw new Error('Unable to find statements for this scope');
  }
};

const getScopeArea = (scope/*: Scope*/) => {
  switch (scope.source.type) {
    case 'program':
      return {
        scopeStart: scope.source.program.start,
        scopeEnd: scope.source.program.end
      };
    case 'block': 
      return {
        scopeStart: scope.source.block.start,
        scopeEnd: scope.source.block.end
      };
    default:
      throw new Error(`Unable to determine start/end of scope`);
  }
};

module.exports = {
  getScopes,
  getScopeStatements,
  getScopeArea,
};