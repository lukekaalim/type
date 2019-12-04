// @flow strict
import generateUUID from 'uuid/v4';
/*::
import type { JSFunctionID } from './jsValues/function';
import type { JSNumberID } from './jsValues/number';
import type { JSBooleanID } from './jsValues/boolean';
*/
/*::
export opaque type IdentifierID = string;
export type Identifier = {
  id: IdentifierID,
  name: string,
};
*/

const createIdentifier = (name/*: string*/)/*: Identifier*/ => ({
  id: generateUUID(),
  name,
});

export {
  createIdentifier,
};
