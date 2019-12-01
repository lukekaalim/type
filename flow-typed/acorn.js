// @flow strict

declare module 'acorn' {
  declare type AcornConfig = {
    onComment?: (isBlock: boolean, comment: string, start: number, end: number) => void,
  }

  declare function parse(sourceCode: string, config?: AcornConfig): EstreeProgram;
  declare module.exports: {
    parse: typeof parse
  };
}