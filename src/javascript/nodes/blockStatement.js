// @flow strict
import { mountVariableDeclaration } from './variableDeclaration.js';
import { createScope } from '../../javascript';
/*::
import type { LumberState, ScopeID } from '../../javascript';
*/

const mountBlockStatement = (lumber/*: LumberState*/, closure/*: ScopeID*/, block/*: EstreeBlockStatement*/) => {
  const scope = createScope(closure);
  block.body.reduce((lumber, statement) => {
    switch (statement.type) {
      case 'VariableDeclaration':
        return mountVariableDeclaration(lumber, closure, statement);
    }
  }, lumber)
};

export {
  mountBlockStatement,
};
