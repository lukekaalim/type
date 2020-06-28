//@flow strict
/*:: import type { Variable, VariableID } from './variables'; */
/*:: import type { Scope } from './scope'; */
/*:: import type { AcornComment } from 'acorn'; */
const uuid = require('uuid/v4.js');
const { getScopeStatements, getScopeArea } = require('./scope');

/*::
export opaque type VariableAnnotationID: string = string;
export type VariableAnnotation = {
  type: 'variable';
  id: VariableAnnotationID,
  variableIds: VariableID[],
  content: string,
};

type Annotations = {
  variableAnnotations: VariableAnnotation[],
};
*/

const getVariableAnnotation = (comment, declaration, scope, variables)/*: VariableAnnotation*/ => {
  const annotatedVariables = variables.filter(variable =>
    variable.scopeId === scope.id &&
    declaration.declarations.some(declaration => declaration.id.name === variable.identifier)
  );

  return {
    type: 'variable',
    id: uuid(),
    variableIds: annotatedVariables.map(variable => variable.id),
    content: comment.value,
  };
};

const getAnnotations = (scopes/*: Scope[]*/, comments/*: AcornComment[]*/, variables/*: Variable[]*/)/*: Annotations*/ => {
  // Not all comments are annotation comments;
  // Only those that are tagged with '@t'
  const taggedComments = comments
    .filter(comment => comment.value.startsWith('@t'));

  // To place an annotation, we need to understand where it is relative to other statements
  // since the location of the annotation determine which variable it's annotating
  const annotations = scopes
    .map(scope => {
      const { scopeStart, scopeEnd } = getScopeArea(scope);
      const statements = getScopeStatements(scope);
      // Only check comments that are within the defined scope
      // And are not inside another statement
      const scopedComments = taggedComments
        .filter(comment => comment.start > scopeStart && comment.end < scopeEnd)
        .filter(comment => !statements.some(statement => comment.start > statement.start && comment.end < statement.end));

      return scopedComments
        .map(comment => {
          // To find the statement the comment is annotating,
          // we check if the comment is between any statements.
          // The 'annotated statement' is the statement _after_ the comment
          const annotatedStatement = statements.find((statement, statementIndex) => {
            const previousStatement = statements[statementIndex - 1];
            if (!previousStatement)
              return comment.end < statement.start;
            return comment.end < statement.start && comment.start > previousStatement.end;
          });

          if (!annotatedStatement)
            throw new Error('Unable to determine statement for the annotation');

          switch (annotatedStatement.type) {
            case 'VariableDeclaration':
              return getVariableAnnotation(comment, annotatedStatement, scope, variables);
            default:
              throw new Error(`Unknown annotation on type ${annotatedStatement.type}`)
          }
        });
    }).flat(1);

  return {
    variableAnnotations: annotations.filter(annotation => annotation.type === 'variable')
  };
};

module.exports = {
  getAnnotations
};