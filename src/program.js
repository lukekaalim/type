// @flow strict
const { Map, Record, List } = require('immutable');
const { generateVariantsFromType } = require('./refinement');
const { areTypesCompatible } = require('./compatibility');
const { UnimplementedError } = require('./errors');
const { generateConstraints } = require('./refinement');
/*::
import type { Statement } from './statements';
import type { TypeID, Type } from './type';
import type { TokenID, Token } from './token';
import type { Constraint } from './constraint';
import type { InstanceID, Instance } from './instance';
import type { Relationship, RelationshipID } from './relationship';

import type { RecordOf, RecordFactory } from 'immutable';

export opaque type ProgramID = string;
export type Program = {
  id: ProgramID,
  statements: List<Statement>,
};

export type ProgramState = {
  types: Map<TypeID, Type>,
  values: Map<InstanceID, Instance>,
  constraints: Constraint[],
  relationships: List<Relationship>,
  exited: boolean,
};
*/

const createProgram/*: RecordFactory<Program>*/ = Record({
  statements: List(),
});

const createProgramState/*: RecordFactory<ProgramState>*/ = Record({
  types: Map(),
  values: Map(),
  constraints: List(),
  relationships: List(),
  exited: false,
});

const flatten = (acc, curr) => [...acc, ...curr];

const runProgram = (
  program/*: RecordOf<Program>*/,
  initialState/*: RecordOf<ProgramState>*/ = createProgramState(),
) => {
  return program.statements.reduce/*:: <List<RecordOf<ProgramState>>>*/((states, statement) =>
    states
      .map(state => reduceState(state, statement))
      .flatten(true),
    List([initialState])
  );
};

const reduceState = (state, statement) => {
  if (state.exited) {
    return List([state]);
  }
  switch (statement.type) {
    case 'create-value':
      return List([
        state.update('values', values => values.set(statement.value.id, statement.value)),
      ]);
    case 'exit':
      return List([
        state.set('exited', true),
      ]);
    case 'branch': {
      const instance = state.values.get(statement.subject);
      if (!instance)
        throw new Error();
      const refinements = generateConstraints(state, instance.id, instance.typeId, state.constraints);
      return refinements.map(constraints => state.set('constraints', constraints));
    }
    /*
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
    /*
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
    */
    default:
      throw new UnimplementedError(`Reduce State, case: ${statement.type}`);
  }
};

module.exports = {
  createProgram,
  createProgramState,
  runProgram,
};