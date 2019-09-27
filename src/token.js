// @flow strict
const generateUUID = require('uuid/v4');

/*::
export opaque type TokenID: string = string;
export type Token = {
  id: TokenID,
}
*/

const createToken = ()/*: Token*/ => ({
  id: generateUUID(),
});

module.exports = {
  createToken,
};