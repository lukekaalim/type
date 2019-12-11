// @flow strict
import generateUUID from 'uuid/v4';
import immutable from 'immutable';
const { Map, List, Record } = immutable;
/*::
import type { RecordOf, RecordFactory } from 'immutable';
import type { Identifier, IdentifierID } from './identifier';
*/
/*::
type ScopeID = string;
type Scope = {
  id: ScopeID,
  closure: ScopeID | null,
};


export type {
  ScopeID,
  Scope,
};
*/

const createScope = (closure/*: ScopeID*/)/*: Scope*/ => ({
  id: generateUUID(),
  closure,
});

export {
  createScope,
};
