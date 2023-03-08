// This is a new module that exposes the public API of the modified 'json-diff'
// modules.
//
// Exports types.

import { roundObj } from './utils';

// @ts-ignore
import JsonDiff from './json-diff';

const { colorize } = require('./colorize');

// Import types from DefinitelyTyped
import * as JsonDiffTypes from 'json-diff';

import CSS from 'csstype';

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

// Definition of 'DiffOptions' in DefinitelyTyped is outdated.
export type DiffOptions = JsonDiffTypes.DiffOptions & { excludeKeys?: string[] };

export type JsonValue =
  | { [x: string]: JsonValue }
  | Array<JsonValue>
  | string
  | number
  | boolean
  | null;

export function diff(
  // using 'unknown' type to keep this compatible with the old json-diff unit tests
  obj1: unknown,

  // using 'unknown' type to keep this compatible with the old json-diff unit tests
  obj2: unknown,

  // quick fix to outdated type definition in DefinitelyTyped: added excludeKeys
  options: DiffOptions = {}
  ): any {

  if (options.precision !== undefined) {
    obj1 = roundObj(obj1, options.precision);
    obj2 = roundObj(obj2, options.precision);
  }
  return new JsonDiff(options).diff(obj1, obj2).result;
}

export function diffRender(
  obj1: JsonValue,
  obj2: JsonValue,
  options: DiffOptions = {},
  customization: StyleCustomization
): JSX.Element {
  return colorize(diff(obj1, obj2, options), options, customization);
}
