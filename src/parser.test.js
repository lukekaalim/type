const { parseExpression } = require('./parser');
const acorn = require("acorn");

const test = () => {
  parseExpression(`
  //boolean
  const main = (input) => {
    if (input) {
      return 1;
    }
    return 0;
  };
  `)
};

test();
