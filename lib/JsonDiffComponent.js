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
import { jsx as _jsx } from "react/jsx-runtime";
import { diffRender } from './JsonDiff/Internal/index';
var defaultStyleCustomization = {
    additionLineStyle: {
        color: 'green',
        lineHeight: 0.5,
    },
    additionClassName: 'addition',
    deletionLineStyle: {
        color: 'red',
        lineHeight: 0.5,
    },
    deletionClassName: 'deletion',
    unchangedLineStyle: {
        lineHeight: 0.5,
    },
    unchangedClassName: 'unchanged',
    frameStyle: {},
    frameClassName: 'diff',
};
export function mkCustomization(customizations) {
    return __assign(__assign({}, defaultStyleCustomization), customizations);
}
/**
 * React.js functional component for a structural JSON diff.
 *
 * @param {Object} props - properties of the component
 * @param {JsonValue} props.original - parsed JSON value
 * @param {JsonValue} props.latest - parsed JSON value
 * @param {Partial<StyleCustomization>=} props.styleCustomization
 * @param {DiffOptions} props.jsonDiffOptions - properties passed to json-diff
 */
export function JsonDiffComponent(props) {
    var _a;
    var actualCustomization = (_a = props.styleCustomization) !== null && _a !== void 0 ? _a : {};
    var fullCustomization = mkCustomization(actualCustomization);
    var diffElement = diffRender(props.original, props.latest, props.jsonDiffOptions, fullCustomization);
    return _jsx("div", { children: diffElement });
}
