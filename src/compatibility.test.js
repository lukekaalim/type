// @flow strict
import { createSimpleType, createImplementingType, createBranchingType } from './type.js';

import { areTypesCompatible } from './compatibility.js';
import { performance } from 'perf_hooks.js';
import { createState } from './program.js';

const testBranchingType = () => {
  const typeA = createSimpleType();
  const typeB = createImplementingType([typeA.id]);
  const typeC = createImplementingType([typeA.id]);
  const typeD = createBranchingType([typeB.id, typeC.id]);

  const typeF = createSimpleType();
  // E is B | C | F
  const typeE = createBranchingType([typeB.id, typeC.id, typeF.id]);

  const typeMap = new Map([
    [typeA.id, typeA],
    [typeB.id, typeB],
    [typeC.id, typeC],
    [typeD.id, typeD],
    [typeF.id, typeF],
    [typeE.id, typeE],
  ]);
  const state = {
    ...createState(),
    typeMap,
  };
  

  console.log('-- Branching Types are compatible if every branch is compatible --');
  console.log('A == D', areTypesCompatible(state.types, typeA.id, typeD.id));
  console.log('A != E', !areTypesCompatible(state.types, typeA.id, typeE.id));
};

const testImplementingType = () => {
  const typeA = createSimpleType();
  const typeD = createSimpleType();
  const typeE = createImplementingType([typeA.id])

  const typeB = createImplementingType([typeD.id, typeA.id]);
  const typeC = createImplementingType([typeE.id]);

  const typeMap = new Map([
    [typeA.id, typeA],
    [typeB.id, typeB],
    [typeC.id, typeC],
    [typeD.id, typeD],
    [typeE.id, typeE],
  ]);
  const state = {
    ...createState(),
    typeMap,
  };

  console.log('-- Implementing Type are compatible if any of the implementors are compatible --');
  console.log('C == B', areTypesCompatible(state.types, typeB.id, typeC.id));
  console.log('B == C', areTypesCompatible(state.types, typeC.id, typeB.id));
  console.log('C == C', areTypesCompatible(state.types, typeC.id, typeC.id));
  console.log('B == B', areTypesCompatible(state.types, typeB.id, typeB.id));
  console.log('A == B', areTypesCompatible(state.types, typeA.id, typeB.id));
  console.log('D != C', !areTypesCompatible(state.types, typeD.id, typeC.id));
}

const testSimpleTypes = () => {
  const typeA = createSimpleType();
  const typeB = createSimpleType();

  const typeMap = new Map([
    [typeA.id, typeA],
    [typeB.id, typeB],
  ]);
  const state = {
    ...createState(),
    typeMap,
  };

  console.log('-- Simple Type --');
  console.log('A != B', !areTypesCompatible(state.types, typeB.id, typeA.id));
  console.log('B != A', !areTypesCompatible(state.types, typeA.id, typeB.id));
  console.log('A == A', areTypesCompatible(state.types, typeA.id, typeA.id));
  console.log('B == B', areTypesCompatible(state.types, typeB.id, typeB.id));
}

const test = async () => {
  const startTime = performance.now();
  testBranchingType()
  testImplementingType();
  testSimpleTypes();
  const endTime = performance.now();
  console.log('Total Time:', Math.ceil((endTime - startTime)*1000), 'μs');
};

test()
  .catch(console.error);