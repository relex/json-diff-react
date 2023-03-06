// This is a new module that exposes the public API of the modified 'json-diff'
// modules.
//
// Exports types.
import { roundObj } from './utils';
// @ts-ignore
import JsonDiff from './json-diff';
var colorize = require('./colorize').colorize;
export function diff(obj1, obj2, options) {
    if (options === void 0) { options = {}; }
    if (options.precision !== undefined) {
        obj1 = roundObj(obj1, options.precision);
        obj2 = roundObj(obj2, options.precision);
    }
    return new JsonDiff(options).diff(obj1, obj2).result;
}
export function diffRender(obj1, obj2, options, customization) {
    if (options === void 0) { options = {}; }
    return colorize(diff(obj1, obj2, options), options, customization);
}
