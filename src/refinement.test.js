// @flow strict
const { generateVariantsFromType } = require('./refinement');
const { areTypesCompatible } = require('./compatibility');
const { createState } = require('./state');
const { createSimpleType, createImplementingType, createBranchingType } = require('./type');
const { createToken } = require('./token');
const { inspect } = require('util')

const test = () => {
  console.log('-- refinement --');
  const trueT = createSimpleType();
  const falseT = createSimpleType();
  const boolean = createBranchingType([trueT.id, falseT.id]);

  const typeMap = new Map([
    [trueT.id, trueT],
    [falseT.id, falseT],
    [boolean.id, boolean],
  ]);

  const state = {
    ...createState(),
    typeMap,
  };

  const variants = generateVariantsFromType(state, boolean.id);
  console.log(variants.length);

  variants.map(([variantState, variantType]) => {
    console.log(areTypesCompatible(variantState, variantType, trueT.id))
  })
};

test();