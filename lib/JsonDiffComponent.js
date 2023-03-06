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
export function JsonDiffComponent(_a) {
    var original = _a.original, latest = _a.latest, onError = _a.onError, _b = _a.styleCustomization, styleCustomization = _b === void 0 ? {} : _b, _c = _a.jsonDiffOptions, jsonDiffOptions = _c === void 0 ? {} : _c;
    var actualCustomization = styleCustomization !== null && styleCustomization !== void 0 ? styleCustomization : {};
    var fullCustomization = mkCustomization(actualCustomization);
    try {
        var parsedOriginal = JSON.parse(original);
        var parsedLatest = JSON.parse(latest);
        var diffElement = diffRender(parsedOriginal, parsedLatest, jsonDiffOptions, fullCustomization);
        return _jsx("div", { children: diffElement });
    }
    catch (e) {
        return onError(new Error(e.toString()));
    }
}
