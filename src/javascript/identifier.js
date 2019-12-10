// @flow strict
import generateUUID from 'uuid/v4';
/*::
import type { JSFunctionID } from './values/function';
import type { JSNumberID } from './values/number';
import type { JSBooleanID } from './values/boolean';
import type { ScopeID } from '../javascript';
*/
/*::
export opaque type IdentifierID = string;
export type Identifier = {
  id: IdentifierID,
  scopeId: ScopeID,
  name: string,
};

*/

const createIdentifier = (name/*: string*/, scopeId/*: ScopeID*/)/*: Identifier*/ => ({
  id: generateUUID(),
  name,
  scopeId,
});

export {
  createIdentifier,
};
