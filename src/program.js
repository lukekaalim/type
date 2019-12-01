// @flow strict
import immutable from 'immutable';
const { Map, Record, List } = immutable;

import { areTypesCompatible } from './compatibility.js';
import { UnimplementedError } from './errors.js';
import { createRefinementsForTypeId } from './refinement.js';
/*::
import type { Statement } from './statements.js';
import type { TypeID, Type } from './type.js';
import type { TokenID, Token } from './token.js';
import type { Constraint } from './constraint.js';
import type { InstanceID, Instance } from './instance.js';
import type { VariantRelationship, VariantRelationshipID, IntersectionRelationshipID, IntersectionRelationship } from './relationship.js';

import type { RecordOf, RecordFactory } from 'immutable';

export opaque type ProgramID = string;
export type Program = {
  id: ProgramID,
  statements: List<Statement>,
  initialState: RecordOf<ProgramState>,
};

export type ProgramState = {
  types: Map<TypeID, Type>,
  values: Map<InstanceID, Instance>,
  constraints: Map<InstanceID, List<Constraint>>,
  variantRelationships: List<VariantRelationship>,
  intersectionRelationships: List<IntersectionRelationship>,
  exited: boolean,
};
*/

const createProgramState/*: RecordFactory<ProgramState>*/ = Record({
  types: Map(),
  values: Map(),
  constraints: Map(),
  variantRelationships: List(),
  intersectionRelationships: List(),
  exited: false,
});

const createProgram/*: RecordFactory<Program>*/ = Record({
  id: '0',
  statements: List(),
  initialState: createProgramState(),
});

const flatten = list => list.reduce((acc, curr) => [...acc, ...curr], []);

const runProgram = (
  program/*: RecordOf<Program>*/,
  initialState/*: RecordOf<ProgramState>*/ = createProgramState(),
) => {
  return program.statements
    .reduce/*:: <RecordOf<ProgramState>[]>*/((states, statement) =>
      flatten(states.map(state => reduceState(state, statement))),
      [initialState]
    )
    .map/*:: <RecordOf<ProgramState>>*/(state => state.set('exited', true));
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

const exported = {
  createProgram,
  createProgramState,
  runProgram
};

export default exported;
export { createProgram, createProgramState, runProgram };