// @flow strict
import { createIdentifier } from '../../javascript';
/*::
import type { LumberState, ScopeID } from '../../javascript';
import type { RecordOf } from 'immutable';
*/

const mountDeclarator = (state, closure, declarator) => {
  const identifier = createIdentifier(declarator.id.name, closure);
  return state
    .update('identifiers', identifiers => identifiers.set(identifier.id, identifier));
}

const mountVariableDeclaration = (state/*: RecordOf<LumberState>*/, closure/*: ScopeID*/, declaration/*: EstreeVariableDeclaration*/) => {
  return declaration.declarations.reduce((state, declarator) => mountDeclarator(state, closure, declarator), state);
};

export {
  mountVariableDeclaration,
};
