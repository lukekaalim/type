// @flow strict
import { createInterface } from 'readline';

import test from '@lukekaalim/test';
const { assert } = test;

const assertFromUser = async (question/*: string*/) => {
  const int = createInterface({ input: process.stdin, output: process.stdout });
  const userResponse = await new Promise(res => int.question(question + ' (Yes/No)\n', answer => {
    int.close();
    res(answer.toLocaleLowerCase());
  }));
  return assert(`Asked the User if this was correct (User said ${userResponse})`, userResponse === 'yes');
};

const assertEqual = (a/*: mixed*/, b/*: mixed*/) => {
  const aString = JSON.stringify(a) || 'undefined';
  const bString = JSON.stringify(b) || 'undefined';
  const equal = a === b;
  const equalitySymbol = equal ? '===' : '!==';
  const equalityText = equal ? 'equal' : 'not equal';
  return assert(`Values (${aString} ${equalitySymbol} ${bString}) are ${equalityText}`, equal);
};

const assertToDo = (value/*: string*/) => {
  console.log(value);
  return assert('Use has not yet decided what a test for this value is', false);
};

const exported = {
  assertFromUser,
  assertToDo,
  assertEqual
};

export default exported;
export { assertFromUser, assertToDo, assertEqual };
