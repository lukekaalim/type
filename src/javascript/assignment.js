// @flow strict
import generateUUID from 'uuid/v4.js';
/*::
import type { IdentifierID, JSValueReference } from '../javascript';
*/

/*::
type AssignmentID = string;
type Assignment = {
  id: AssignmentID,
  identifierId: IdentifierID,
  valueReference: JSValueReference,
};

export type {
  AssignmentID,
  Assignment,
};
*/

const createAssignment = (identifierId/*: IdentifierID*/, valueReference/*: JSValueReference*/)/*: Assignment*/ => ({
  id: generateUUID(),
  identifierId,
  valueReference,
});

export {
  createAssignment,
};
