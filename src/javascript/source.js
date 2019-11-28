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

const getLineFromIndex = (source/*: string*/, charIndex/*: number*/)/*: number*/ => {
  const lines = source.split('\n');
  const lineLengths = lines.map/*:: <number>*/(line => line.length + 1);
  const lineDistances = lineLengths.reduce/*:: <number[]>*/((acc, curr, index) => [...acc, curr + (acc[index - 1] || 0)], []);
  return lineDistances.findIndex(distance => charIndex < distance);
};

const getLinesFromLocation = (source/*: string*/, location/*: SourceLocation*/)/*: [number, number]*/ => {
  return [getLineFromIndex(source, location.start), getLineFromIndex(source, location.end)];
};

module.exports = {
  createSourceLocation,
  getLineFromIndex,
  getLinesFromLocation,
}
