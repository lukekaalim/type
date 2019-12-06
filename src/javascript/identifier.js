// @flow strict
import generateUUID from 'uuid/v4';
/*::
import type { JSFunctionID } from './jsValues/function';
import type { JSNumberID } from './jsValues/number';
import type { JSBooleanID } from './jsValues/boolean';
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
