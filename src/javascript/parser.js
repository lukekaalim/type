// @flow strict
/*::
import type { Identifier, ValueToken, TypeToken } from './token';
import type { RecordFactory, RecordOf } from 'immutable';
*/
const { Record, Map } = require('immutable');
const { parse } = require("acorn");
/*::
type JSParserState = {
  valueTokens: Map<Identifier, ValueToken>,
  typeTokens: Map<Identifier, TypeToken>,
};
*/
const createJsParserState/*: RecordFactory<JSParserState>*/ = Record({ valueTokens: Map(), typeTokens: Map() },'JSParserState');

const getProgramFromSource = (source/*: string*/) => {
  const estree = parse(source);
  console.log(JSON.stringify(estree, null, 2));
};

module.exports = {
  createJsParserState,
  getProgramFromSource,
};