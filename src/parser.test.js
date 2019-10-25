// @flow strict
const { parseExpression } = require('./parser');
const { createBasicJavascriptEnvironment } = require('./environment');
const { getProgramState } = require('./program');
const acorn = require("acorn");
const { Set } = require('immutable');

const env = createBasicJavascriptEnvironment();

const test = () => {
  const source = `
//boolean
const main = (input) => {
  if (input) {
    return 1;
  }
  return 0;
};
  `;

  const program = parseExpression(source, env.tokens.toSet());
  const states = getProgramState(program, env.initalState);

  const instanceIdToTypeIdentifier = (instanceId, instances, types, tokens) => {
    const instance = instances.find(instance => instance.id ===  instanceId);
    const type = types.find(type => type.id === instance.typeId);
    const token = tokens.find(token => token.type === 'type-token' && token.typeId === type.id);
    
    return token.identifier;
  };

  states
    .map(state => [...state.instances.keys()].map(instanceId => instanceIdToTypeIdentifier(
      instanceId,
      state.instances,
      state.types,
      env.tokens,
    )))
    .map(([inp, out]) => console.log(inp, '=>', out))
};

test();
