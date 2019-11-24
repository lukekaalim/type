// @flow strict
const generateUUID = require('uuid/v4');
/*::
import type { RecordFactory, RecordOf } from 'immutable';
import type { ProgramState } from '../program';
import type { TypeID } from '../type';
import type { LumberState } from './parser';
import type { Instance } from '../instance';
*/
const { List } = require('immutable');
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
  sawmillStates/*: RecordOf<ProgramState>[]*/,
  argumentValue/*: Instance*/,
)/*: FunctionSignature[]*/ => {
  return sawmillStates
    .map(({ types, values, constraints }) => {
      const undefinedType = lumberState.typeTokens.get('undefined');
      if (!undefinedType)
        throw new Error('Can\'t return then type Undefined when the environment does not support Undefined!')
      
      const returnValue = lumberState.returnValue ? values.get(lumberState.returnValue) : null;
      const returnType = returnValue ? returnValue.typeId : undefinedType.typeId;
      console.log(constraints);
      const throwType = undefinedType.typeId;
      const argumentTypes = List([argumentValue.typeId]);

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
