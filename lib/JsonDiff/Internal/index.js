// This is a new module that exposes the public API of the modified 'json-diff'
// modules.
//
// Exports types.
import { roundObj } from './utils';
import JsonDiff from './json-diff';
import { colorize } from './colorize';
export function diff(
// using 'unknown' type to keep this compatible with the old json-diff unit tests
obj1, 
// using 'unknown' type to keep this compatible with the old json-diff unit tests
obj2, 
// quick fix to outdated type definition in DefinitelyTyped: added excludeKeys
options) {
    if (options === void 0) { options = {}; }
    if (options.precision !== undefined) {
        obj1 = roundObj(obj1, options.precision);
        obj2 = roundObj(obj2, options.precision);
    }
    return new JsonDiff(options).diff(obj1, obj2).result;
}
export function diffRender(jsonA, jsonB, options, customization) {
    if (options === void 0) { options = {}; }
    return colorize(diff(jsonA, jsonB, options), options, customization);
}
