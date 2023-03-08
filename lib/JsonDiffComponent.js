var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { diffRender } from './JsonDiff/Internal/index';
// Default style customization only sets class names to their default values.
var defaultStyleCustomization = {
    additionLineStyle: null,
    additionClassName: 'addition',
    deletionLineStyle: null,
    deletionClassName: 'deletion',
    unchangedLineStyle: null,
    unchangedClassName: 'unchanged',
    frameStyle: null,
    frameClassName: 'diff',
};
export function mkCustomization(customizations) {
    return __assign(__assign({}, defaultStyleCustomization), customizations);
}
/**
 * React.js functional component for a structural JSON diff.
 *
 * @param {Object} props - properties of the component
 * @param {JsonValue} props.jsonA - parsed JSON value (fed to diff)
 * @param {JsonValue} props.jsonB - parsed JSON value (fed to diff)
 * @param {Partial<StyleCustomization>=} props.styleCustomization
 * @param {DiffOptions} props.jsonDiffOptions - properties passed to json-diff
 */
export function JsonDiffComponent(props) {
    var _a;
    var actualCustomization = (_a = props.styleCustomization) !== null && _a !== void 0 ? _a : {};
    var fullCustomization = mkCustomization(actualCustomization);
    return diffRender(props.jsonA, props.jsonB, props.jsonDiffOptions, fullCustomization);
}
