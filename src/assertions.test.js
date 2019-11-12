// @flow strict
const { createInterface } = require('readline');
const { assert } = require('@lukekaalim/test');

const assertFromUser = async (question/*: string*/) => {
  const interface = createInterface({ input: process.stdin, output: process.stdout });
  const userResponse = await new Promise(res => interface.question(question + ' (Yes/No)\n', answer => {
    interface.close();
    res(answer.toLocaleLowerCase());
  }));
  return assert(`Asked the User if this was correct (User said ${userResponse})`, userResponse === 'yes');
};

const assertToDo = (value/*: string*/) => {
  console.log(value);
  return assert('Use has not yet decided what a test for this value is', false);
};

module.exports = {
  assertFromUser,
  assertToDo,
};
