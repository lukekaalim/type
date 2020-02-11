// @flow strict
/*::
import type { AcornComment } from 'acorn';
*/

const createAnnotationFromComment = (comment/*: AcornComment*/) => {
  if (comment.value.startsWith('?')) {
    return null;
  }
  return createAnnotationFromString(comment.value.slice(1));
};

const createAnnotationFromString = (inputString/*: string*/) => {
  const jsonParsed = JSON.parse(inputString);
  const params = jsonParsed.parameters.map(param => createTypeAnnotation(param.identifier))
  return createFunctionAnnotation(params, jsonParsed.returns,jsonParsed.throws);
};

export {
  createAnnotationFromString,
};
