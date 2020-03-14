// @flow strict

declare module 'acorn' {
  declare function parse(sourceCode: string, config?: AcornConfig): EstreeProgram;

  declare class Parser {
    extend: (...plugins: Parser[]) => void,
    parse: typeof parse,
  }

  declare export type AcornComment = {
    "type": "Line" | "Block",
    "value": string,
    "start": number,
    "end": number,
    "loc": {
      "start": { line: number, column: number },
      "end": { line: number, column: number },
    },
  }

  declare type AcornConfig = {
    onComment?: Array<AcornComment> | (isBlock: boolean, comment: string, start: number, end: number) => void,
    locations?: true,
    sourceType?: 'module',
  }
  declare module.exports: {
    parse: typeof parse,
    Parser: typeof Parser
  };
}