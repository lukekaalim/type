// @flow strict
const generateUUID = require('uuid/v4');
const { createProgram } = require('./program');
/*::
import type { TypeID, Type } from './type';
import type { Instance, InstanceID } from './instance';
import type { TokenID } from './token';
import type { Program } from './program';
import type { Constraint } from './constraint';
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

export type DeclareBranchStatement = {
  id: StatementID,
  type: 'declare-if-branch',
  targetTypeId: TypeID,
  instanceIdToRefine: InstanceID,
  hitProgram: Program,
  missProgram: Program,
};

export type Statement =
  | ExitStatement
  | CreateValueStatement
  | ConstrainStatement
  | BranchStatement
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

module.exports = {
  createValue,
  constrain,
  exit,
  branch,
};
