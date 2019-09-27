// @flow strict
const { generateVariantsFromType } = require('./src/refinement');
const { areTypesCompatible } = require('./src/compatibility');
const { createState } = require('./src/state');
const { createSimpleType, createImplementingType, createBranchingType } = require('./src/type');

const test = () => {
  console.log('-- refinement --');
  const trueT = createSimpleType();
  const falseT = createSimpleType();

  const E = createBranchingType([trueT.id, falseT.id]);
  const D = createImplementingType([E.id])

  const typeMap = new Map([
    [trueT.id, trueT],
    [falseT.id, falseT],
    [E.id, E],
    [D.id, D],
  ]);
  const state = {
    ...createState(),
    typeMap,
  };

  const variants = generateVariantsFromType(state, D)

  console.log(variants.map(variant => {
    return areTypesCompatible(variant.state ,variant.type.id, trueT.id);
  }));
};

test();