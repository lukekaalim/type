// @flow strict
const { createProgram, getProgramState } = require('./src/program');

const test = () => {
  const program = createProgram([
    
  ]);
  const state = getProgramState(program);
  console.log(state);
};

test();