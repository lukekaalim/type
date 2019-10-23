// @flow strict
const { Map, Record } = require('immutable');
const { generateVariantsFromType } = require('./refinement');
const { getProgramState } = require('./program');
const { areTypesCompatible } = require('./compatibility');
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';
import type { InstanceID, Instance } from './instance';
import type { RecordOf, RecordFactory } from 'immutable';

export type State = {
  types: Map<TypeID, Type>,
  instances: Map<InstanceID, Instance>,
  returnedInstanceId: null | InstanceID;
};

*/
const { UnimplementedError } = require('./errors');

const reduceState = (state/*: State*/, statement/*: Statement*/)/*: Array<State>*/ => {
  if (state.returnedInstanceId !== null) {
    return [state];
  }
  switch (statement.type) {
    case 'declare-instance':
      return [{ ...state, instances: state.instances.set(statement.declaredInstance.id, statement.declaredInstance) }];
    case 'declare-type':
      return [{ ...state, types: state.types.set(statement.declaredType.id, statement.declaredType) }];
    case 'declare-return':
      return [{ ...state, returnedInstanceId: statement.declaredReturnInstanceID }];
    case 'declare-if-branch': {
      const instance = state.instances.get(statement.instanceIdToRefine);
      if (!instance)
        throw new Error();
      return generateVariantsFromType(state.types, instance.typeId)
        .map(([types, typeId]) => {
          const newState = {
            ...state,
            types,
            instances: state.instances.set(instance.typeId, { ...instance, typeId }),
          }
          if (areTypesCompatible(types, typeId, statement.targetTypeId)) {
            
            return getProgramState(statement.hitProgram, { ...state, types });
          } else {
            return getProgramState(statement.missProgram, { ...state, types });
          }
        }).reduce((acc, curr) => [...acc, ...curr], []);
    }
    default:
      throw new UnimplementedError('Reduce State');
  }
};

const createState = ()/*: State*/ => ({
  types: Map(),
  instances: Map(),
  returnedInstanceId: null,
});

module.exports = {
  reduceState,
  createState,
};