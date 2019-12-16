// @flow strict
import generateUUID from 'uuid/v4.js';

/*::
import type { TypeID, Type } from './type.js';
import type { Instance, InstanceID } from './instance.js';
import type { TokenID } from './token.js';
import type { Program } from './program.js';
import type { Constraint } from './constraint.js';
import type { RecordOf } from 'immutable';

export opaque type StatementID = string;
export type CreateValueStatement = {
  id: StatementID,
  type: 'create-value',
  value: Instance,
};
export type ExitStatement = {
  id: StatementID,
  type: 'exit'
};

export type ConstrainStatement = {
  id: StatementID,
  type: 'constrain',
  constraint: Constraint,
}

export type BranchStatement = {
  id: StatementID,
  type: 'branch',
  assertion: TypeID,
  subject: InstanceID,

  ifProgram: RecordOf<Program>,
  elseProgram: RecordOf<Program>,
}

export type SubprogramStatement = {
  id: StatementID,
  type: 'subprogram',
  program: Program,

  inputConstraints: Constraint[],
  outputConstraints: Constraint[],
}

export type Statement =
  | ExitStatement
  | CreateValueStatement
  | ConstrainStatement
  | BranchStatement
  | SubprogramStatement
*/

const createValue = (value/*: Instance*/)/*: CreateValueStatement*/ => ({
  id: generateUUID(),
  type: 'create-value',
  value,
});

const exit = ()/*: ExitStatement*/ => ({
  id: generateUUID(),
  type: 'exit',
});

const constrain = (constraint/*: Constraint*/)/*: ConstrainStatement*/ => ({
  id: generateUUID(),
  type: 'constrain',
  constraint,
});

const branch = (
  assertion/*: TypeID*/,
  subject/*: InstanceID*/,
  ifProgram/*: RecordOf<Program>*/,
  elseProgram/*: RecordOf<Program>*/,
)/*: BranchStatement*/ => ({
  id: generateUUID(),
  type: 'branch',
  assertion,
  subject,
  ifProgram,
  elseProgram,
});

const exported = {
  createValue,
  constrain,
  exit,
  branch
};

export default exported;
export { createValue, constrain, exit, branch };
