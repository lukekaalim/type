// @flow strict
import immutable from 'immutable';
const { Map, Record, List } = immutable;
import type { ValueID, Value, IntersectionRelationship, VariantRelationship } from './lumber';

import { areTypesCompatible } from './compatibility.js';
import { UnimplementedError } from './errors.js';
import { createRefinementsForTypeId } from './refinement.js';
/*::
import type { Statement, StatementID } from './statements.js';
import type { TypeID, Type } from './type.js';
import type { TokenID, Token } from './token.js';
import type { Constraint } from './constraint.js';

type IDMap<T> = Map<$PropertyType<T, 'id'>, T>;

import type { RecordOf, RecordFactory } from 'immutable';

export opaque type ProgramID: string = string;
export type Program = {
  id: ProgramID,

  statements: IDMap<Statement>,
  types: IDMap<Type>,
  values: IDMap<Value>,

  intersections: IDMap<IntersectionRelationship>,
  variants: IDMap<VariantRelationship>,

  executionOrder: StatementID[],
  inputs: ValueID[],
  outputs: ValueID[],
};

export type Speculation = {
  constraints: IDMap<Constraint>,
  terminated: boolean,
};
*/

const createSpeculation = ()/*: Speculation*/  => ({
  terminated: false,
  constraints: Map(),
});

const runProgram = (program/*: Program*/, initialSpeculations/*: Speculation[]*/ = [createSpeculation()])/*: Speculation[]*/ => {
  return initialSpeculations;
};

const reduceState = (state/*: RecordOf<ProgramState>*/, statement) => {
  if (state.exited) {
    return [state];
  }
  switch (statement.type) {
    case 'create-value':
      return [
        state.update('values', values => values.set(statement.value.id, statement.value)),
      ];
    case 'exit':
      return [
        state.set('exited', true),
      ];
    case 'branch': {
      const instance = state.values.get(statement.subject);
      if (!instance)
        throw new Error();
      const refinements = createRefinementsForTypeId(state, instance.typeId, state.constraints.get(instance.id, List()));
      return refinements.map(newConstraints => state
        .update('constraints', constraints => constraints.set(instance.id, newConstraints.constraints))
      );
    }
    default:
      throw new UnimplementedError(`Reduce State, case: ${statement.type}`);
  }
};

export { createProgram, createProgramState, runProgram };