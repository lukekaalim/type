// @flow strict

// composed of nothing but whitespace.
const whitespaceRegex = new RegExp(/^\s*$/);

// the word 'note' or 'type', the two keywords
const keywordRegex = new RegExp(/^\s*(?<keyword>note|type)/);

const parseSourceToGrammer = (source/*: string*/) => {
  if (whitespaceRegex.test(source))
    return [];

  const keywordResult = keywordRegex.exec(source);
  if (keywordResult === null)
    throw new Error('Invalid Grammer, no valid keywords found');
  
  const { groups, index } = keywordResult;
  const { keyword } = groups;
  switch (keyword) {
    case 'note':
      return parseNote(source.slice(index + keyword.length));
    case 'type':
      return parseType(source.slice(index + keyword.length));
  }
  // step 2a: if annotation, return expression
  // step 2b: if type, get identifier, return expression
};

// the end of a statement
const terminalRegex = new RegExp(/^\s*;/);

const parseNote = (source/*: string*/) => {
  const [expression, remainingSource] = parseExpression(source);

  const terminalResult = terminalRegex.exec(remainingSource);
  if (terminalResult === null)
    throw new Error('No termination token (;) for string');
  const [capture] = terminalResult;

  return expression;
};

const parseType = () => {
  throw new Error('Type declarations are not yet supported')
};

// characters wrapped in quotes
const stringRegex = new RegExp(/^\s*(?<quote>['"`])(?<value>[\s\S]*)\1/);
// numbers with signs and floating points
const numberRegex = new RegExp(/^\s*(?<value>[+-]?[\d]+(?:.\d*)?)/);

const parseExpression = (source/*: string*/) => {
  const stringResult = stringRegex.exec(source);
  if (stringResult !== null) {
    const [capture] = stringResult;
    const { groups, index } = stringResult;
    const { quote, value } = groups;
    return [{ type: 'string', quote, value }, source.slice(index + capture.length)];
  }
  const numberResult = numberRegex.exec(source);
  if (numberResult !== null) {
    const [capture] = numberResult;
    const { groups, index } = numberResult;
    const { value } = groups;
    return [{ type: 'number', value: parseFloat(value) }, source.slice(index + capture.length)];
  }
  throw new Error('Unsupported primative');
};

console.log(parseSourceToGrammer('note "Hello";'));
console.log(parseSourceToGrammer('note -100.0;'));
console.log(parseSourceToGrammer('type ballast 100;'));