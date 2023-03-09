// This is a new module that exposes the public API of the modified 'json-diff'
// modules.
//
// Exports types.
import { roundObj } from './utils';
import JsonDiff from './json-diff';
import { colorize } from './colorize';
export function diff(
// using 'unknown' type to keep this compatible with the old json-diff unit tests
jsonA, 
// using 'unknown' type to keep this compatible with the old json-diff unit tests
jsonB, 
// quick fix to outdated type definition in DefinitelyTyped: added excludeKeys
options = {}) {
    if (options.precision !== undefined) {
        jsonA = roundObj(jsonA, options.precision);
        jsonB = roundObj(jsonB, options.precision);
    }
    return new JsonDiff(options).diff(jsonA, jsonB).result;
}
export function diffRender(jsonA, jsonB, options = {}, customization) {
    return colorize(diff(jsonA, jsonB, options), options, customization);
}
