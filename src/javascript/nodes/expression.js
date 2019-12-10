// @flow strict
/*::
import type { LumberState, JSValues, ScopeID, IdentifierID } from '../../javascript';
import type { Value } from '../../instance';
*/
import { createFunction, mergeValues } from '../../javascript.js';
import { compose2 } from 'compose-typed';

const mountExpression = (lumber/*: LumberState*/, scopeId/*: ScopeID*/, expression/*: EstreeExpression*/)/*: [Value, LumberState]*/ => {
  switch (expression.type) {
    case 'ArrowFunctionExpression': {
      const func = createFunction(lumber, expression);
      
      const stateWithValue = lumber
        .update('values', values => mergeValues(values, func.values));

      return [func.value, stateWithValue];
    }
    default:
      throw new Error(`Unsupported expression type: ${expression.type}`);
  }
};

export {
  mountExpression,
};
