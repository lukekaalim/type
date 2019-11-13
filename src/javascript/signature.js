// @flow strict
const generateUUID = require('uuid/v4');
/*::
import type { RecordFactory, RecordOf, List } from 'immutable';
import type { ProgramState } from '../program';
import type { TypeID } from '../type';
import type { LumberState } from './parser';
*/
/*::
export opaque type FunctionSignatureID = string;
export type FunctionSignature = {
  id: FunctionSignatureID,
  typeId: TypeID,

  argumentTypes: List<TypeID>,
  returnType: TypeID,
  throwType: TypeID,
};
*/

const resolveConstraint = (constraints, value) => {
  const finalConstraint = constraints.findLast(constraint => constraint.value === value, null, null);
  if (finalConstraint) {
    return finalConstraint.typeConstraint;
  }
  return null;
};

const createFunctionSignatures = (
  typeId/*: TypeID*/,
  lumberState/*: RecordOf<LumberState>*/,
  sawmillStates/*: List<RecordOf<ProgramState>>*/
)/*: List<FunctionSignature>*/ => {
  return sawmillStates
    .map(({ types, values, constraints }) => {
      const undefinedType = lumberState.typeTokens.get('undefined');
      if (!undefinedType)
        throw new Error('Can\'t return then type Undefined when the environment does not support Undefined!')

      const returnType = resolveConstraint(constraints, lumberState.returnValue) || undefinedType.typeId;
      const throwType = resolveConstraint(constraints, lumberState.throwValue) || undefinedType.typeId;
      const argumentTypes = lumberState.argumentValues.map(argumentValue => resolveConstraint(constraints, argumentValue) || undefinedType.typeId);

      return {
        id: generateUUID(),
        typeId,

        argumentTypes,
        returnType,
        throwType
      };
    })
};

module.exports = {
  createFunctionSignatures,
};
