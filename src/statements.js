// @flow strict
const generateUUID = require('uuid/v4');
const { createProgram } = require('./program');
/*::
import type { TypeID, Type } from './type';
import type { Instance, InstanceID } from './instance';
import type { TokenID } from './token';
import type { Program } from './program';

export opaque type StatementID: string = string;

export type DeclareTypeStatement = {
  id: StatementID,
  type: 'declare-type',
  declaredType: Type,
};
export type DeclareInstanceStatement = {
  id: StatementID,
  type: 'declare-instance',
  declaredInstance: Instance,
};
export type DeclareReturnStatement = {
  id: StatementID,
  type: 'declare-return',
  declaredReturnInstanceID: InstanceID,
};
export type DeclareIfBranchStatement = {
  id: StatementID,
  type: 'declare-if-branch',
  targetTypeId: TypeID,
  instanceIdToRefine: InstanceID,
  hitProgram: Program,
  missProgram: Program,
};

export type DeclareSubProgramStatement = {
  id: StatementID,
  type: 'declare-subprogram',
  subprogram: Program,
}

export type Statement =
  | DeclareTypeStatement
  | DeclareInstanceStatement
  | DeclareReturnStatement
  | DeclareIfBranchStatement
  | DeclareSubProgramStatement
*/

const createDeclareTypeStatement = (declaredType/*: Type*/)/*: DeclareTypeStatement*/ => ({
  id: generateUUID(),
  type: 'declare-type',
  declaredType,
});

const createDeclareInstanceStatement = (declaredInstance/*: Instance*/)/*: DeclareInstanceStatement*/ => ({
  id: generateUUID(),
  type: 'declare-instance',
  declaredInstance,
});

const createDeclareReturnStatement = (declaredReturnInstanceID/*: InstanceID*/)/*: DeclareReturnStatement*/ => ({
  id: generateUUID(),
  type: 'declare-return',
  declaredReturnInstanceID,
});

const createDeclareIfBranchStatement = (
  instanceIdToRefine/*: InstanceID*/,
  targetTypeId/*: TypeID*/,
  hitProgram/*: Program*/,
  missProgram/*: Program*/ = createProgram([]),
)/*: DeclareIfBranchStatement*/ => ({
  id: generateUUID(),
  type: 'declare-if-branch',
  instanceIdToRefine,
  targetTypeId,
  hitProgram,
  missProgram,
});

const createDeclareSubProgram = (
  subprogram/*: Program*/,
)/*: DeclareSubProgramStatement */ => ({
  id: generateUUID(),
  subprogram,
  type: 'declare-subprogram'
});

module.exports = {
  createDeclareInstanceStatement,
  createDeclareTypeStatement,
  createDeclareReturnStatement,
  createDeclareIfBranchStatement,
  createDeclareSubProgram,
};
