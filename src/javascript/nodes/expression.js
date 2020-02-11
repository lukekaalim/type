// @flow strict
/*::
import type {
  LumberState,
  JSValues,
  JSValueReference,
  ScopeID,
  IdentifierID,
  AnnotationExpression,
} from '../../javascript';
import type { TypeID } from '../../type';
*/
import { createFunction, createFunctionReference, mergeValues } from '../../javascript.js';

const mountExpression = (
  lumber/*: LumberState*/,
  scopeId/*: ScopeID*/,
  expression/*: EstreeExpression*/,
  annotation/*: AnnotationExpression | null*/
)/*: [JSValueReference, LumberState]*/ => {
  switch (expression.type) {
    case 'ArrowFunctionExpression': {
      if (annotation && annotation.type !== 'function-expression') {
        throw new Error('Declared function but provided function expression annotation: WFT?');
      }
      const newFunction = createFunction(lumber, scopeId, expression, annotation);
      const newFunctionReference = createFunctionReference(newFunction.id);

      return [
        newFunctionReference,
        lumber
          .update('values', values => mergeValues(values, newFunction.values))
      ];
    }
    default:
      throw new Error(`Unsupported expression type: ${expression.type}`);
  }
};

export {
  mountExpression,
};
