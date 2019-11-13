// @flow strict
const generateUUID = require('uuid/v4');
const { createProgram } = require('./program');
/*::
import type { TypeID, Type } from './type';
import type { Instance, InstanceID } from './instance';
import type { TokenID } from './token';
import type { Program } from './program';
import type { Constraint } from './constraint';

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

module.exports = {
  createValue,
  constrain,
  exit,
};
