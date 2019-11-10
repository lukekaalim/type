// @flow strict
const generateUUID = require('uuid/v4');
/*::
import type { SourceLocation } from './source';
import type { TokenID } from './token';
*/

/*::
export opaque type AnnotationID = string;
export type Annotation =
  | FunctionAnnotation
  | TypeTokenAnnotation
  | ValueTokenAnnotation

export type TypeTokenAnnotation = {
  id: AnnotationID,
  type: 'type-token',
  tokenId: TokenID,
};

export type ValueTokenAnnotation = {
  id: AnnotationID,
  type: 'value-token',
  tokenId: TokenID,
};

export type FunctionAnnotation = {
  id: AnnotationID,
  loc: SourceLocation,
  type: 'function',

  parameters: AnnotationID[],
  returns: null | AnnotationID,
  throws: null | AnnotationID,
};
*/

const createTypeAnnotation = (
  tokenId/*: TokenID*/,
)/*: TypeTokenAnnotation*/ => ({
  id: generateUUID(),
  type: 'type-token',
  tokenId,
})

const createFunctionAnnotation = (
  loc/*: SourceLocation*/,
  parameters/*: AnnotationID[]*/,
  returns/*: null | AnnotationID*/ = null,
  throws/*: null | AnnotationID*/ = null,
)/*: FunctionAnnotation*/ => ({
  id: generateUUID(),
  type: 'function',
  loc,
  parameters,
  returns,
  throws,
});

module.exports = {
  createFunctionAnnotation,
  createTypeAnnotation,
};

/*!

//! (string, number) => boolean, NewError | OldError | OtherError
const abc = (a, b) => c
*/