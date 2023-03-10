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

  // This option was added only to this library. It wasn’t a part of original json-diff library.
  // It allows you to customize “...”/“... (N entries)” template.
  // Can also be useful to support localizations other than English.
  //
  // Arguments:
  // - “elisionCount” is a counter of how many elisions were in a row (1 is minimal).
  // - “maxElisions” is forwarded from these options (“Infinity” by default).
  // Return value is either:
  // - A “string” — For instance a single ”...” or “... (5 entries)” when exceeded “maxElisions”
  // - A list of “string”s — Multiple elisions to render (e.g. “['...', '...', '...']”)
  // It’s totally fine to return a list of one value (e.g. “['... (5 entries)']”).
  //
  // Defaults to:
  // (n, max) => (n < max ? [...Array(n)].map(() => '...') : `... (${n} entries)`)
  renderElision?: (elisionCount: number, maxElisions: number) => string | string[];
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
