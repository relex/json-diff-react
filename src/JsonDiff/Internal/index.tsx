// This is a new module that exposes the public API of the modified 'json-diff'
// modules.
//
// Exports types.

import { roundObj } from './utils';

// @ts-ignore
import JsonDiff from './json-diff';

const { colorize } = require('./colorize');

// for types
import { DiffOptions } from 'json-diff';

import CSS from 'csstype';

export type { DiffOptions } from 'json-diff';

export type StyleCustomization = {
  additionLineStyle: CSS.Properties;
  additionClassName: string;
  deletionLineStyle: CSS.Properties;
  deletionClassName: string;
  unchangedLineStyle: CSS.Properties;
  unchangedClassName: string;
  frameStyle: CSS.Properties;
  frameClassName: string;
};

export function diff(obj1: unknown, obj2: unknown, options: DiffOptions = {}): any {
  if (options.precision !== undefined) {
    obj1 = roundObj(obj1, options.precision);
    obj2 = roundObj(obj2, options.precision);
  }
  return new JsonDiff(options).diff(obj1, obj2).result;
}

export function diffRender(
  obj1: unknown,
  obj2: unknown,
  options: DiffOptions = {},
  customization: StyleCustomization
): JSX.Element {
  return colorize(diff(obj1, obj2, options), options, customization);
}
