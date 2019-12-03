// @flow strict
/*::
import type { LumberState } from './parser';
import type { RecordOf } from 'immutable';
*/
import { createIdentifier } from './identifier';
import { parseArrowFunctionExpression } from './jsValues/function';

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
};

const parseVariableDeclaration = (state/*: RecordOf<LumberState>*/, assignmentStatement/*: EstreeVariableDeclaration*/) => {
  switch (assignmentStatement.kind) {
    case 'const':
      return parseConstantDeclaration(state, assignmentStatement);
    default:
      throw new Error(`Unsupported assignment type: ${assignmentStatement.kind}`);
  }
};