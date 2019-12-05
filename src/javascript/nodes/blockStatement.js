// @flow strict
/*::
import type { LumberState, ScopeID } from '../../javascript';
*/

const getIdentifiersForBlockStatement = blockStatement => {
  const declarations = blockStatement.body.filter(statement => statement.type === 'VariableDeclaration');
};

const mountBlockStatement = (lumber/*: LumberState*/, closure/*: ScopeID*/, blockStatement/*: EstreeBlockStatement*/) => {
  const assignments = getIdentifiersForBlockStatement(blockStatement);
};

export {
  mountBlockStatement,
};
