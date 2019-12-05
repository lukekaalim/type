// @flow strict
import generateUUID from 'uuid/v4';
/*::
import type { List } from 'immutable';
import type { Identifier, IdentifierID } from './identifier';
import type { AssignmentID } from './assignment';
*/
/*::
type ScopeID = string;
type Scope = {
  id: ScopeID,
  identifierAssignments: List<AssignmentID>,
  closure: ScopeID,
};

export type {
  ScopeID,
  Scope,
};
*/

const createScope = (identifierAssignments/*: List<AssignmentID>*/, closure/*: ScopeID*/)/*: Scope*/ => ({
  id: generateUUID(),
  identifierAssignments,
  closure,
});

export {
  createScope,
};
