// @flow strict

declare module 'acorn' {
  declare type AcornConfig = {
    onComment?: (isBlock: boolean, comment: string, start: number, end: number) => void,
  }

  declare export function parse(sourceCode: string, config?: AcornConfig): EstreeProgram;
}