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
type IdentifierExpression = {
  type: 'identifier',
  identifier: string,
};

type ValueExpression = {
  type: 'value',
  literal: mixed,
};

export type {
  InlineAnnotationID,
  InlineAnnotation,

  Expression,
  FunctionExpression,
  ValueExpression,
  IdentifierExpression,
};
*/

export * from './annotation/declaration.js';