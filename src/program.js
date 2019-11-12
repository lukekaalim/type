// @flow strict
const { Map, Record } = require('immutable');
const { generateVariantsFromType } = require('./refinement');
const { areTypesCompatible } = require('./compatibility');
const { UnimplementedError } = require('./errors');
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';
import type { InstanceID, Instance } from './instance';
import type { RecordOf, RecordFactory } from 'immutable';

export type Program = {
  statements: Array<Statement>,
};

export type State = {
  types: Map<TypeID, Type>,
  instances: Map<InstanceID, Instance>,
  returnedInstanceId: null | InstanceID;
};
*/

const createState = ()/*: State*/ => ({
  types: Map(),
  instances: Map(),
  returnedInstanceId: null,
});

const DEFAULT_STATE = createState();

const createProgram = (statements/*: Array<Statement>*/) => ({
  statements,
});

const flatten = (acc, curr) => [...acc, ...curr];

const getProgramState = (program/*: Program*/, initialState/*: State*/ = DEFAULT_STATE)/*: State[]*/ => {
  return program.statements.reduce((states, statement) =>
    // for each state the program currently has, calculate it, and add it back (plus any other variants that it generated) back to the list of states
    states.map(state => reduceState(state, statement)).reduce(flatten, []),
    [initialState]
  );
};

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
    case 'declare-subprogram': {
      const subProgramStates = getProgramState(statement.subprogram, state);
      console.log(subProgramStates);
      return [{ ...state,  }];
    }
    case 'declare-if-branch': {
      const instance = state.instances.get(statement.instanceIdToRefine);
      if (!instance)
        throw new Error();
      return generateVariantsFromType(state.types, instance.typeId)
        .map(([types, typeId]) => {
          const newState = {
            ...state,
            types,
            instances: state.instances.set(instance.id, { ...instance, typeId }),
          }
          if (areTypesCompatible(newState.types, typeId, statement.targetTypeId)) {
            return getProgramState(statement.hitProgram, newState);
          } else {
            return getProgramState(statement.missProgram, newState);
          }
        }).reduce(flatten, []);
    }
    default:
      throw new UnimplementedError(`Reduce State, case: ${statement.type}`);
  }
};

module.exports = {
  reduceState,
  createState,
  createProgram,
  getProgramState,
};