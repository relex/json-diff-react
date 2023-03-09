// This is a new module that exposes the public API of the modified 'json-diff'
// modules.
//
// Exports types.

import { roundObj } from './utils';
import JsonDiff from './json-diff';

import { colorize } from './colorize';

// Import types from DefinitelyTyped
import * as JsonDiffTypes from 'json-diff';

import CSS from 'csstype';

export type StyleCustomization = {
  additionLineStyle: CSS.Properties | null;
  additionClassName: string | null | undefined;
  deletionLineStyle: CSS.Properties | null;
  deletionClassName: string | null | undefined;
  unchangedLineStyle: CSS.Properties | null;
  unchangedClassName: string | null | undefined;
  frameStyle: CSS.Properties | null;
  frameClassName: string | null | undefined;
};

// Definition of 'DiffOptions' in DefinitelyTyped is outdated.
export type DiffOptions = JsonDiffTypes.DiffOptions & {
  excludeKeys?: string[];

  // This was implemented as part of this library. It’s turned on by default.
  // It renders elisions like `...` for objects in the similar way it’s done for arrays.
  showElisionsForObjects?: boolean;
};

export type JsonValue =
  | { [x: string]: JsonValue }
  | Array<JsonValue>
  | string
  | number
  | boolean
  | null;

export function diff(
  // using 'unknown' type to keep this compatible with the old json-diff unit tests
  jsonA: unknown,

  // using 'unknown' type to keep this compatible with the old json-diff unit tests
  jsonB: unknown,

  // quick fix to outdated type definition in DefinitelyTyped: added excludeKeys
  options: DiffOptions = {}
): unknown {
  if (options.precision !== undefined) {
    jsonA = roundObj(jsonA, options.precision);
    jsonB = roundObj(jsonB, options.precision);
  }
  return new JsonDiff(options).diff(jsonA, jsonB).result;
}

export function diffRender(
  jsonA: JsonValue,
  jsonB: JsonValue,
  options: DiffOptions = {},
  customization: StyleCustomization
): JSX.Element {
  return colorize(diff(jsonA, jsonB, options), options, customization);
}
