// @flow strict
/*::
import type { LumberState } from './parser';
import type { RecordOf } from 'immutable';
import type { JSFunctionID } from './jsValues/function';
import type { IdentifierID } from './identifier';
*/
import { createIdentifier } from './identifier';
import { parseArrowFunctionExpression } from './jsValues/function';

/*::
type AssignmentID = string;

type FunctionAssignment = {
  id: AssignmentID,
  identifierId: IdentifierID,
  type: 'function',
  functionId: JSFunctionID,
};

type ValueAssignment =
  | FunctionAssignment

type Assignment =
  | ValueAssignment;

export type {
  AssignmentID,
  Assignment,
};
*/

// TODO: Refactor
const parseExpression = (state, expression) => {
  switch (expression.type) {
    case 'ArrowFunctionExpression':
      return parseArrowFunctionExpression(state, expression);
    default:
      throw new Error(`Unsupported expression type: ${expression.type}`);
  }
};

const parseConstantDeclarator = (state, assignmentDeclarator) => {
  const identifier = createIdentifier(assignmentDeclarator.id.name);
  const expressionResult = parseExpression(state, assignmentDeclarator.init);
};

const parseConstantDeclaration = (state, assignmentStatement) => {
  assignmentStatement.declarations.map(declaration => parseConstantDeclarator(state, declaration));
  return state;
};

const parseVariableDeclaration = (state/*: RecordOf<LumberState>*/, assignmentStatement/*: EstreeVariableDeclaration*/) => {
  switch (assignmentStatement.kind) {
    case 'const':
      return parseConstantDeclaration(state, assignmentStatement);
    default:
      throw new Error(`Unsupported assignment type: ${assignmentStatement.kind}`);
  }
};
