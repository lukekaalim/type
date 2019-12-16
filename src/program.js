// @flow strict
import immutable from 'immutable';
const { Map, Record, List } = immutable;

import { areTypesCompatible } from './compatibility.js';
import { UnimplementedError } from './errors.js';
import { createRefinementsForTypeId } from './refinement.js';
/*::
import type { ValueID, Value, IntersectionRelationship, VariantRelationship } from './sawmill';
import type { Statement, StatementID } from './statements.js';
import type { Type } from './type.js';
import type { Token } from './token.js';
import type { Constraint, ConstraintID } from './constraint.js';

import type { RecordOf, RecordFactory } from 'immutable';

export opaque type ProgramID: string = string;
export type Program = {
  id: ProgramID,

  statements: Statement[],
  types: Type[],
  values: Value[],

  intersections: IntersectionRelationship[],
  variants: VariantRelationship[],

  executionOrder: OrderedSet<StatementID>,
  inputs: ValueID[],
  outputs: ValueID[],
};

export type Speculation = {
  constraints: Map<ConstraintID, Constraint>,
  terminated: boolean,
};
*/

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

export {  };