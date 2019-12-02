// @flow strict
/*::
type AnnotationSourceLocation = {

};
*/
import { createFunctionAnnotation, createTypeAnnotation } from './annotation.js';

const createAnnotationFromString = (inputString/*: string*/) => {
  const jsonParsed = JSON.parse(inputString);
  const params = jsonParsed.parameters.map(param => createTypeAnnotation(param.identifier))
  return createFunctionAnnotation(params, jsonParsed.returns,jsonParsed.throws);
};

export {
  createAnnotationFromString,
};
