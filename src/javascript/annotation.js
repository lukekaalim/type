// @flow strict
import generateUUID from 'uuid/v4.js';

import immutable from 'immutable';
const { Record, Map } = immutable;
/*::
import type { SourceLocation } from './source.js';
import type { TokenID } from './token.js';
import type { RecordFactory } from 'immutable';
*/

/*::
type TypeIdentifierAnnotationID = string;
type TypeIdentifierAnnotation = {
  id: TypeIdentifierAnnotationID,
  type: 'type-identifier',
  identifier: string,
};

type ValueLiteralAnnotationID = string;
type ValueLiteralAnnotation = {
  id: ValueLiteralAnnotationID,
  type: 'value-literal',
  literal: string,
};

type AnnotationExpression =
  | FunctionExpressionAnnotation
  | TypeIdentifierAnnotation
  | ValueLiteralAnnotation

type FunctionExpressionAnnotationID = string;
type FunctionExpressionAnnotation = {
  id: FunctionExpressionAnnotationID,
  type: 'function-expression',

  parameters: AnnotationExpression[],
  returns: null | AnnotationExpression,
  throws: null | AnnotationExpression,
};

type AnnotationStatement = {
  expression: AnnotationExpression
};

export type {
  AnnotationStatement,
  AnnotationExpression,

  FunctionExpressionAnnotation,
};
*/

const createTypeAnnotation = (
  identifier/*: string*/,
)/*: TypeIdentifierAnnotation*/ => ({
  id: generateUUID(),
  type: 'type-identifier',
  identifier,
});

const createValueAnnotation = (
  literal/*: string*/,
)/*: ValueLiteralAnnotation*/ => ({
  id: generateUUID(),
  type: 'value-literal',
  literal,
})

const createFunctionAnnotation = (
  parameters/*: ExpressionAnnotation[]*/ = [],
  returns/*: null | ExpressionAnnotation*/ = null,
  throws/*: null | ExpressionAnnotation*/ = null,
)/*: FunctionExpressionAnnotation*/ => ({
  id: generateUUID(),
  type: 'function-expression',
  parameters,
  returns,
  throws,
});

const exported = {
  createFunctionAnnotation,
  createTypeAnnotation,
  createValueAnnotation
};

/*!

//! (string, number) => boolean, NewError | OldError | OtherError
const abc = (a, b) => c
*/

export default exported;
export { createFunctionAnnotation, createTypeAnnotation, createValueAnnotation };