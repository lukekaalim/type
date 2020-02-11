// @flow strict
import { createIdentifier, mountExpression, createAssignment } from '../../javascript.js';
/*::
import type { LumberState, ScopeID } from '../../javascript';
import type { RecordOf } from 'immutable';
*/

const mountDeclarator = (state, closure, declarator) => {
  const identifier = createIdentifier(declarator.id.name, closure);

  const stateWithIdentifier = state
    .update('identifiers', identifiers => identifiers.set(identifier.id, identifier));

  const [reference, stateWithValue] = mountExpression(stateWithIdentifier, closure, declarator.init);

  const assignment = createAssignment(identifier.id, reference);

  const stateWithAssignment = stateWithValue
    .update('assignments', assignments => assignments.set(assignment.id, assignment))

  return stateWithAssignment;
}

const mountVariableDeclaration = (state/*: LumberState*/, closure/*: ScopeID*/, declaration/*: EstreeVariableDeclaration*/) => {
  return declaration.declarations.reduce((state, declarator) => mountDeclarator(state, closure, declarator), state);
};

export {
  mountVariableDeclaration,
};
