// @flow strict
/*::
import type { Identifier, ValueToken, TypeToken } from './token';
import type { RecordFactory, RecordOf } from 'immutable';
*/
const { Record, Map } = require('immutable')
/*::
type JSParserState = {
  valueTokens: Map<Identifier, ValueToken>,
  typeTokens: Map<Identifier, TypeToken>,
};
*/
const createJsParserState/*: RecordFactory<JSParserState>*/ = Record({ valueTokens: Map(), typeTokens: Map() },'JSParserState');


module.exports = {
  createJsParserState,
};