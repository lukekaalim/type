// @flow strict
import { createIdentifier, mountExpression } from '../../javascript';
/*::
import type { LumberState, ScopeID } from '../../javascript';
import type { RecordOf } from 'immutable';
*/

const mountDeclarator = (state, closure, declarator) => {
  const identifier = createIdentifier(declarator.id.name, closure);

  const stateWithIdentifier = state
    .update('identifiers', identifiers => identifiers.set(identifier.id, identifier));

  return mountExpressionToIdentifier(stateWithIdentifier, identifier, closure, declarator.init);
}

const mountVariableDeclaration = (state/*: LumberState*/, closure/*: ScopeID*/, declaration/*: EstreeVariableDeclaration*/) => {
  return declaration.declarations.reduce((state, declarator) => mountDeclarator(state, closure, declarator), state);
};

export {
  mountVariableDeclaration,
};
