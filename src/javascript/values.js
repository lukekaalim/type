// @flow strict
const generateUUID = require('uuid/v4');

/*::
export opaque type JSValueID = string;
export type JSValue =
  | LiteralNumberValue;

export type LiteralNumberValue = {
  id: JSValueID,
  type: 'literal-number',
  value: number,
};
*/

const createLiteralNumber = (value/*: number*/)/*: LiteralNumberValue*/ => ({
  id: generateUUID(),
  type: 'literal-number',
  value
});

module.exports = {
  createLiteralNumber,
};
