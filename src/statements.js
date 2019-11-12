// @flow strict
const generateUUID = require('uuid/v4');
const { createProgram } = require('./program');
/*::
import type { TypeID, Type } from './type';
import type { Instance, InstanceID } from './instance';
import type { TokenID } from './token';
import type { Program } from './program';

export opaque type StatementID = string;

export type DeclareInstanceStatement = {
  id: StatementID,
  type: 'declare-instance',
  declaredInstance: Instance,
};

export type DeclareBranchStatement = {
  id: StatementID,
  type: 'declare-if-branch',
  targetTypeId: TypeID,
  instanceIdToRefine: InstanceID,
  hitProgram: Program,
  missProgram: Program,
};

// Special decorative statements
export type DeclareOutputStatement = {
  id: StatementID,
  type: 'declare-ouput',
  outputIds: InstanceID[],
};
export type DeclareInputStatement = {
  id: StatementID,
  type: 'declare-input',
  inputIds: InstanceID[],
};
export type DeclareSubProgramStatement = {
  id: StatementID,
  type: 'declare-subprogram',
  subprogram: Program,
}

export type Statement =
  | DeclareInstanceStatement
  | DeclareOutputStatement
  | DeclareInputStatement
  | DeclareBranchStatement
  | DeclareReturnStatement
  | DeclareIfBranchStatement
  | DeclareSubProgramStatement
*/

const declareInstance = (declaredInstance/*: Instance*/)/*: DeclareInstanceStatement*/ => ({
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
