// @flow strict

declare module "perf_hooks" {
  declare class Performance {
    now(): number;
  }
  declare export var performance: Performance;
}