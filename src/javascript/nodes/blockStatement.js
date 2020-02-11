// @flow strict
import { mountVariableDeclaration } from './variableDeclaration.js';
import { createScope } from '../../javascript.js';
/*::
import type { LumberState, ScopeID } from '../../javascript';
import type { RecordOf } from 'immutable';
*/

const mountBlockStatement = (lumber/*: LumberState*/, closure/*: ScopeID*/, block/*: EstreeBlockStatement*/) => {
  const scope = createScope(closure);
  block.body.reduce((lumber, statement) => {
    switch (statement.type) {
      case 'VariableDeclaration':
        return mountVariableDeclaration(lumber, closure, statement);
      default:
        return lumber;
    }
  }, lumber)
};

export {
  mountBlockStatement,
};
