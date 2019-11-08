// @flow strict
/*::
import type { SourceLocation } from './source';
*/
/*::
export opaque type AnnotationID = string;

export type Annotation = 
  | FunctionAnnotationID

export opaque type ExpressionAnnotationID = string;

export opaque type FunctionAnnotationID = string;
export type FunctionAnnotation = {
  id: FunctionAnnotationID,
  loc: SourceLocation,

  parameters: ExpressionAnnotationID[],
  returns: ExpressionAnnotationID,
  throws: ExpressionAnnotationID,
};
*/
const createFunctionAnnotation = (loc/*: SourceLocation*/, parameters/*: ExpressionAnnotationID[]*/) => ({

});

/*!

//! (string, number) => boolean, NewError | OldError | OtherError
const abc = (a, b) => c
*/