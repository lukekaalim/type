// @flow strict
/*:: import type { Scope, ScopeID } from './scope'; */
const uuid = require('uuid/v4.js');

/*::
export opaque type VariableID: string = string;
export type Variable = {
  id: VariableID,
  scopeId: ScopeID,
  identifier: string,
  kind: 'const' | 'let' | 'var',
};
*/

const getVariableFromDeclarator = (scope, declaration, declarator)/*: Variable*/ => {
  return {
    id: uuid(),
    scopeId: scope.id,
    identifier: declarator.id.name,
    kind: declaration.kind,
  };
};

const getVariablesFromStatement = (scope, statement)/*: Variable[]*/ => {
  switch (statement.type) {
    case 'VariableDeclaration':
      return statement.declarations
        .map(declarator => getVariableFromDeclarator(scope, statement, declarator));
    default:
      return [];
  }
};

const getVariablesFromScope = (scope/*: Scope*/) => {
  switch (scope.source.type) {
    case 'block':
      return scope.source.block.body
        .map(statement => getVariablesFromStatement(scope, statement))
        .flat(1);
    case 'program':
      return scope.source.program.body
        .map(statement => getVariablesFromStatement(scope, statement))
        .flat(1);
    default:
      return [];
  }
}

const getVariables = (scopes/*: Scope[]*/)/*: Variable[]*/ => {
  const variables = scopes
    .map(scope => getVariablesFromScope(scope))
    .flat(1);

  return variables;
};

module.exports = {
  getVariables,
};
