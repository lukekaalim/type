// @flow strict
const { generateVariantsFromType } = require('./src/refinement');
const { areTypesCompatible } = require('./src/compatibility');
const { createState } = require('./src/state');
const { createSimpleType, createImplementingType, createBranchingType } = require('./src/type');
const { createToken } = require('./src/token');
const { inspect } = require('util')

const test = () => {
  console.log('-- refinement --');
  const trueT = createSimpleType();
  const falseA = createSimpleType();
  const falseB = createSimpleType();

  const E = createBranchingType([trueT.id, falseA.id, falseB.id]);
  const D = createImplementingType([E.id]);

  const mainToken = createToken();
  const tokens = new Set([mainToken]);
  const typeMap = new Map([
    [trueT.id, trueT],
    [falseA.id, falseA],
    [falseB.id, falseB],
    [E.id, E],
    [D.id, D],
  ]);
  const tokenMap = new Map([
    [mainToken.id, D.id]
  ]);
  const state = {
    ...createState(),
    tokenMap,
    typeMap,
  };

  const variants = generateVariantsFromType(state, mainToken, D);

  console.log(inspect(state, { depth: null }));

  for (const variant of variants) {
    console.log(inspect(variant, { showHidden: false, depth: null }))
  }
};

test();