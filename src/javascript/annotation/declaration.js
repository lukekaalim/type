// @flow strict
import generateUUID from 'uuid/v4.js';
/*::
import type { Expression } from '../annotation.js';

type DeclarationAnnotationID = string;
type DeclarationAnnotation = {
  type: 'declaration',
  id: DeclarationAnnotationID,
  identifierText: string,
  declaredExpression: Expression,
};
*/

// this is a very simple and dumb regex
// TODO: replace with an actual parser
const annotationDeclarationRegularExpression = /^!\s*type\s(.+)\s=([\s\S]+);\s*$/;

class NotADeclarationError extends Error {
  constructor(message/*:: ?: string*/) {
    super(message);
  }
}

const createDeclaration = (annotationText/*: string*/)/*: DeclarationAnnotation*/ => {
  const regularExpressionResult = annotationText.matchAll(annotationDeclarationRegularExpression);

  if (regularExpressionResult === null)
    throw new NotADeclarationError();

  const [firstResult] = (regularExpressionResult/*: any*/);

  const [, identifierText, expressionText] = firstResult;
  
  const declaration = {
    type: 'declaration',
    id: generateUUID(),
    identifierText,
    declaredExpression: { type: 'value', literal: null }
  };

  return declaration;
};

export {
  createDeclaration,
  NotADeclarationError,
}