// @flow strict
import { createProgram, getProgramState } from './program.js';

import { createInstance } from './instance.js';
import { createSimpleType, createBranchingType, createImplementingType } from './type.js';

import {
  createDeclareInstanceStatement,
  createDeclareTypeStatement,
  createDeclareReturnStatement,
  createDeclareIfBranchStatement,
} from './statements';

const test = () => {
  const trueType = createSimpleType();
  const falseType = createSimpleType();
  const nullType = createSimpleType();

  const falsyType = createBranchingType([nullType.id, falseType.id]);

  const alphaType = createSimpleType();
  const betaType = createSimpleType();

  const booleanType = createBranchingType([trueType.id, falsyType.id]);

  const argumentInstance = createInstance(booleanType.id);

  const alphaInstance = createInstance(alphaType.id);
  const betaInstance = createInstance(betaType.id);

  const typeNameMap = new Map([
    [trueType.id, 'true'],
    [falseType.id, 'false'],
    [booleanType.id, 'boolean'],
    [alphaType.id, 'alpha'],
    [betaType.id, 'beta'],
    [falsyType.id, 'falsy'],
    [nullType.id, 'null']
  ]);

  const program = createProgram([
    createDeclareTypeStatement(nullType),
    createDeclareTypeStatement(trueType),
    createDeclareTypeStatement(falseType),
    
    createDeclareTypeStatement(falsyType),
    createDeclareTypeStatement(booleanType),

    createDeclareTypeStatement(alphaType),
    createDeclareTypeStatement(betaType),

    createDeclareInstanceStatement(argumentInstance),

    createDeclareIfBranchStatement(argumentInstance.id, trueType.id,
      createProgram([
        createDeclareInstanceStatement(alphaInstance),
        createDeclareReturnStatement(alphaInstance.id)
      ]),
      createProgram([]),
    ),
    createDeclareInstanceStatement(betaInstance),
    createDeclareReturnStatement(betaInstance.id),
  ]);
  const states = getProgramState(program);
  
  for (const { returnedInstanceId, types, instances } of states) {
    if (returnedInstanceId) {
      const argumentInstance2 = instances.get(argumentInstance.id);
      const returnedInstance = instances.get(returnedInstanceId);
      if (returnedInstance && argumentInstance2) {
        
        const argumentTypeName = typeNameMap.get(argumentInstance2.typeId);
        const returnTypeName = typeNameMap.get(returnedInstance.typeId);
        if (argumentTypeName && returnTypeName) {
          console.log(`(${argumentTypeName}) => ${returnTypeName}`);
        } else {
          console.log(types.get(returnedInstance.typeId));
          console.log(types.get(argumentInstance2.typeId));
          console.log(argumentInstance2.typeId, returnedInstance.typeId);
          console.error('Type name was missing')
        }
      }
    } else {
      console.log('Program did not return anything');
    }
  }
};

test();