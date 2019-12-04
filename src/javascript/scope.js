// @flow strict
import immutable from 'immutable';
const { Record, Map } = immutable;
/*::
import type { Identifier, IdentifierID } from './identifier';
import type { List, RecordOf, RecordFactory } from 'immutable';
import type { AssignmentID } from './assignment';
*/
/*::
type ScopeID = string;
type _scope = {
  id: ScopeID,
  assignments: Map<IdentifierID, AssignmentID>,
  closure: ScopeID,
};

type Scope = RecordOf<_scope>;

export type {
  ScopeID,
  Scope,
};
*/

const createScope/*: RecordFactory<_scope>*/ = Record({

});

export {
  createScope,
};
