// @flow strict

declare module "perf_hooks" {
  declare class Performance {
    now(): number;
  }
  declare export var performance: Performance;
}

declare module "console" {
  import type { Writable } from 'stream';
  declare export class Console {
    constructor({
      stdout: Writable,
      stderr: Writable,
      colorMode?: boolean | 'auto',
      inspectOptions?: { depth?: number }
    }): Console;
    log(...subjects: mixed[]): string;
  }
}