// @flow strict

declare module 'acorn' {
  declare function parse(sourceCode: string, config?: AcornConfig): EstreeProgram;

  declare opaque type VarToken;
  declare opaque type ConstToken;

  declare var tokenTypes: {
    _const: ConstToken,
    _var: VarToken,
  };

  declare class Parser {
    constructor(options: ?AcornConfig, input: string, startPos?: number): Parser,
    pos: number,
    curLine: number,
    lineStart: number,
    input: string,
    options: AcornConfig,
    skipBlockComment(): void,
    skipLineComment(count?: number): void,
    parseStatement(context: {}, topLevel: EstreeProgram, exports: {}): EstreeStatement,
    parseTopLevel(node: EstreeStatement): EstreeProgram,
    readToken_slash(): void,
    getTokenFromCode(code: number): void,
    readToken(code: number): void,
    extend(...plugins: Parser[]): Parser,
    parse(): EstreeProgram,
    static parse(sourceCode: string, config?: AcornConfig): EstreeProgram,
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
    locations?: boolean,
    sourceType?: 'module',
  }
  declare module.exports: {
    parse: typeof parse,
    Parser: typeof Parser,
    nonASCIIwhitespace: RegExp,
    tokTypes: typeof tokenTypes,
  };
}