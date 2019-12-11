// @flow strict
/*::
import type { LumberState, JSValues, JSValueReference, ScopeID, IdentifierID } from '../../javascript';
import type { TypeID } from '../../type';
*/
import { createFunction, createFunctionReference, mergeValues, } from '../../javascript.js';
import { compose2 } from 'compose-typed';

const mountExpression = (lumber/*: LumberState*/, scopeId/*: ScopeID*/, expression/*: EstreeExpression*/)/*: [JSValueReference, LumberState]*/ => {
  switch (expression.type) {
    case 'ArrowFunctionExpression': {
      const newFunction = createFunction(lumber, expression);
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
