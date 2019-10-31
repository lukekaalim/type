// @flow strict

/*::
export type SourceLocation = {
  start: number,
  end: number,
};
*/

const createSourceLocation = (start/*: number*/, end/*: number*/)/*: SourceLocation*/ => ({
  start,
  end,
});

module.exports = {
  createSourceLocation,
}
