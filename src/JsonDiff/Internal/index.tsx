import { roundObj } from './utils';

// @ts-ignore
import JsonDiff from './json-diff';

import CSS from 'csstype';

const { colorize } = require('./colorize')

export type JsonDiffOptions = {
  maxElisions?: number,
  precision?: number,
  outputKeys?: string[],
  excludeKeys?: string[],
  full?: boolean,
  sort?: boolean,
  keysOnly?: boolean,
  keepUnchangedValues?: boolean,
  outputNewOnly?: boolean,
};

export type StyleCustomization = {
  additionLineStyle: CSS.Properties,
  additionClassName: string,
  deletionLineStyle: CSS.Properties,
  deletionClassName: string,
  unchangedLineStyle: CSS.Properties,
  unchangedClassName: string
}

export function diff (obj1: object, obj2: object, options: JsonDiffOptions = {}) {
  if (options.precision !== undefined) {
    obj1 = roundObj(obj1, options.precision)
    obj2 = roundObj(obj2, options.precision)
  }
  return new JsonDiff(options).diff(obj1, obj2).result
}

export function diffString (
  obj1: object, 
  obj2: object, 
  options: JsonDiffOptions = {}, 
  customization: StyleCustomization
) {
  return colorize(diff(obj1, obj2, options), options, customization)
}
