// @flow strict
const generateUUID = require('uuid/v4');
/*::
import type { RecordFactory, RecordOf } from 'immutable';
import type { ProgramState } from '../program';
import type { TypeID } from '../type';
import type { LumberState } from './parser';
import type { Instance, InstanceID } from '../instance';
import type { Constraint } from '../constraint';
*/
const { List, Map } = require('immutable');
const { createInstance } = require('../instance');
/*::
export opaque type FunctionSignatureID = string;

export type ParameterID = string;

type Parameter = {
  id: ParameterID,
  constraints: Constraint[],
  typeId: TypeID,
}

export type FunctionSignature = {
  id: FunctionSignatureID,

  parameters: Parameter[],

  arguments: ParameterID[],
  returns: ParameterID,
  throws: ParameterID,
};
*/

const resolveConstraint = (constraints, value) => {
  const finalConstraint = constraints.findLast(constraint => constraint.value === value, null, null);
  if (finalConstraint) {
    return finalConstraint.typeConstraint;
  }
  return null;
};

const getTypeIdFromInstanceId = (lumber, sawmill, valueId) => {
  if (!valueId) {
    return lumber.primitives.undefined.id;
  }
  const value = sawmill.values.get(valueId);
  if (!value) {
    return lumber.primitives.undefined.id
  }
  return value.typeId;
};

const createParamter = (typeId, constraints) => ({
  id: generateUUID(),
  constraints,
  typeId,
});

const createFunctionSignatures = (
  lumber/*: RecordOf<LumberState>*/,
  sawmill/*: RecordOf<ProgramState>*/,
)/*: FunctionSignature[]*/ => {
  const { returnValueId, throwValueId, argumentValuesIds } = lumber;

  const returnTypeId = getTypeIdFromInstanceId(lumber, sawmill, returnValueId);
  const throwTypeId = getTypeIdFromInstanceId(lumber, sawmill, throwValueId);
  const argumentsTypeIds = (argumentValuesIds || []).map(valueId => getTypeIdFromInstanceId(lumber, sawmill, returnValueId));

  const returnParamter = createParamter(sawmill.constraints)

  return {

  };

  return sawmillStates
    .map(({ types, values, constraints }) => {
      const undefinedType = lumberState.typeTokens.get('undefined');
      if (!undefinedType)
        throw new Error('Can\'t return then type Undefined when the environment does not support Undefined!')
      
      const returnValue = lumberState.returnValue ? values.get(lumberState.returnValue) : null;
      const returnType = returnValue ? returnValue.typeId : undefinedType.typeId;
      const throwType = undefinedType.typeId;
      const argumentTypes = List([argumentValue.typeId]);

      return {
        id: generateUUID(),

        constraints: List(constraints),
        argumentTypes,
        returnType,
        throwType
      };
    })
};

module.exports = {
  createFunctionSignatures,
};
