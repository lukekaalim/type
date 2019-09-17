const createType = (token, subTypes = []) => ({
  token,
  subTypes,
});

const createProgram = (statements) => ({
  statements,
});

const identityFunction = a => a;

const stringType = createType('ecma/string');
const numberType = createType('ecma/number');

const magicStatement = (type, token) => ({
  statementType: 'magic',
  type,
  token,
});

const constrainStatement = (type, token) => ({
  statementType: 'constrain',
  type,
  token,
});

const functionStatement = (functionType, argumentToken, returnToken) => ({
  statementType: 'function',
  argumentToken,
  returnToken,
  functionType,
});

const program = createProgram([
  magicStatement(stringType, 'greeting'),
  magicStatement(numberType, 'exitCode'),
  functionStatement(identityFunction, 'greeting', 'loudGreeting'),
]);

const addSymbol = (state, token, type) => {
  if (state.symbols.find((existingSymbol) => existingSymbol.token === token))
    return { ...state, error: new Error('Duplicate Symbol Declaration') };
  return {
    ...state,
    symbols: [...state.symbols, { token, type } ],
  };
};

const isTypeCompat = (a, b) => {
  if (a.id === b.id) {
    return true;
  } else {
    return !!a.subTypes.find(subType => isTypeCompat(subType, b));
  }
}

const checkConstraint = (state, token, type) => {
  const symbol = state.symbols.find(existingSymbol => existingSymbol.token === token);
  if (!symbol)
    return { ...state, error: new Error('Symbol does not exist') };
  if (!isTypeCompat(symbol.type, type))
    return { ...state, error: new Error('Type does not match constraint') };
  return state;
};

const functionCall = (state, functionType, argumentToken, returnToken) => {
  const argumentSymbol = state.symbols.find((existingSymbol) => existingSymbol.token === argumentToken);
  const returnType = functionType(argumentSymbol.type);
  return addSymbol(state, returnToken, returnType);
};

const checkProgram = (program) => {
  const finalState = program.statements.reduce((state, statement) => {
    if (state.error) {
      return state;
    }
    switch (statement.statementType) {
      case 'magic':
        return addSymbol(state, statement.token, statement.type);
      case 'function':
        return functionCall(state, statement.functionType, statement.argumentToken, statement.returnToken);
      case 'constrain':
        return checkConstraint(state, statement.token, statement.type);
      default:
        return state;
    }s
  }, { symbols: [], error: null });
  return finalState;
};

console.log(JSON.stringify(checkProgram(program), null, 2));