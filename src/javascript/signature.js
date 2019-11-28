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
  constraints: List<Constraint>,
  typeId: TypeID,
}

export type FunctionSignature = {
  id: FunctionSignatureID,

  parameters: Map<ParameterID, Parameter>,

  argumentParameterIds: List<ParameterID>,
  returnsParameterId: ParameterID,
  throwsParameterId: ParameterID,
};
*/

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

const getConstraintsFromInstanceId = (sawmill, valueId) => {
  if (!valueId) {
    return List();
  }
  const constraints = sawmill.constraints.get(valueId);
  if (!constraints) {
    return List();
  }
  return constraints;
}

const createParamter = (typeId, constraints)/*: Parameter*/ => ({
  id: generateUUID(),
  constraints,
  typeId,
});

const createFunctionSignature = (
  lumber/*: RecordOf<LumberState>*/,
  sawmill/*: RecordOf<ProgramState>*/,
)/*: FunctionSignature*/ => {
  const { returnValueId, throwValueId, argumentValuesIds } = lumber;

  const returnTypeId = getTypeIdFromInstanceId(lumber, sawmill, returnValueId);
  const throwTypeId = getTypeIdFromInstanceId(lumber, sawmill, throwValueId);
  const argumentsTypeIds = argumentValuesIds.map(valueId => getTypeIdFromInstanceId(lumber, sawmill, valueId));

  const returnsParameter = createParamter(returnTypeId, getConstraintsFromInstanceId(sawmill, returnValueId));
  const throwsParameter = createParamter(throwTypeId, getConstraintsFromInstanceId(sawmill, throwValueId));
  const argumentParameters = argumentsTypeIds.map((typeId, index) => createParamter(typeId, getConstraintsFromInstanceId(sawmill, argumentValuesIds.get(index))));

  const parameters = Map([
    [returnsParameter.id, returnsParameter],
    [throwsParameter.id, throwsParameter],
    ...argumentParameters.map(a => [a.id, a]),
  ]);

  return {
    id: generateUUID(),

    parameters,

    returnsParameterId: returnsParameter.id,
    throwsParameterId: throwsParameter.id,
    argumentParameterIds: argumentParameters.map(a => a.id),
  };
};

module.exports = {
  createFunctionSignature,
};
