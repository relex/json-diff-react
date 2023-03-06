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
// Copied from 'json-diff' with minor modifications.
//
// The 'colorize' function was adapted from console rendering to browser
// rendering - it now returns a JSX.Element.
import { extendedTypeOf } from './utils';
import React from 'react';
var subcolorizeToCallback = function (options, key, diff, output, color, indent) {
    var _a;
    var subvalue;
    var prefix = key ? "".concat(key, ": ") : '';
    var subindent = indent + '  ';
    var outputElisions = function (n) {
        var maxElisions = options.maxElisions === undefined ? Infinity : options.maxElisions;
        if (n < maxElisions) {
            for (var i = 0; i < n; i++) {
                output(' ', subindent + '...');
            }
        }
        else {
            output(' ', subindent + "... (".concat(n, " entries)"));
        }
    };
    switch (extendedTypeOf(diff)) {
        case 'object':
            if ('__old' in diff && '__new' in diff && Object.keys(diff).length === 2) {
                subcolorizeToCallback(options, key, diff.__old, output, '-', indent);
                return subcolorizeToCallback(options, key, diff.__new, output, '+', indent);
            }
            else {
                output(color, "".concat(indent).concat(prefix, "{"));
                for (var _i = 0, _b = Object.keys(diff); _i < _b.length; _i++) {
                    var subkey = _b[_i];
                    var m = void 0;
                    subvalue = diff[subkey];
                    if ((m = subkey.match(/^(.*)__deleted$/))) {
                        subcolorizeToCallback(options, m[1], subvalue, output, '-', subindent);
                    }
                    else if ((m = subkey.match(/^(.*)__added$/))) {
                        subcolorizeToCallback(options, m[1], subvalue, output, '+', subindent);
                    }
                    else {
                        subcolorizeToCallback(options, subkey, subvalue, output, color, subindent);
                    }
                }
                return output(color, "".concat(indent, "}"));
            }
        case 'array': {
            output(color, "".concat(indent).concat(prefix, "["));
            var looksLikeDiff = true;
            for (var _c = 0, diff_1 = diff; _c < diff_1.length; _c++) {
                var item = diff_1[_c];
                if (extendedTypeOf(item) !== 'array' ||
                    !(item.length === 2 || (item.length === 1 && item[0] === ' ')) ||
                    !(typeof item[0] === 'string') ||
                    item[0].length !== 1 ||
                    ![' ', '-', '+', '~'].includes(item[0])) {
                    looksLikeDiff = false;
                }
            }
            if (looksLikeDiff) {
                var op = void 0;
                var elisionCount = 0;
                for (var _d = 0, diff_2 = diff; _d < diff_2.length; _d++) {
                    _a = diff_2[_d], op = _a[0], subvalue = _a[1];
                    if (op === ' ' && subvalue == null) {
                        elisionCount++;
                    }
                    else {
                        if (elisionCount > 0) {
                            outputElisions(elisionCount);
                        }
                        elisionCount = 0;
                        if (![' ', '~', '+', '-'].includes(op)) {
                            throw new Error("Unexpected op '".concat(op, "' in ").concat(JSON.stringify(diff, null, 2)));
                        }
                        if (op === '~') {
                            op = ' ';
                        }
                        subcolorizeToCallback(options, '', subvalue, output, op, subindent);
                    }
                }
                if (elisionCount > 0) {
                    outputElisions(elisionCount);
                }
            }
            else {
                for (var _e = 0, diff_3 = diff; _e < diff_3.length; _e++) {
                    subvalue = diff_3[_e];
                    subcolorizeToCallback(options, '', subvalue, output, color, subindent);
                }
            }
            return output(color, "".concat(indent, "]"));
        }
        default:
            if (diff === 0 || diff === null || diff === false || diff === '' || diff) {
                return output(color, indent + prefix + JSON.stringify(diff));
            }
    }
};
var colorizeToCallback = function (diff, options, output) {
    return subcolorizeToCallback(options, '', diff, output, ' ', '');
};
export var colorize = function (diff, options, customization) {
    if (options === void 0) { options = {}; }
    var output = [];
    var className;
    var style;
    colorizeToCallback(diff, options, function (color, line) {
        if (color === ' ') {
            className = customization.unchangedClassName;
            style = customization.unchangedLineStyle;
        }
        else if (color === '+') {
            className = customization.additionClassName;
            style = customization.additionLineStyle;
        }
        else {
            className = customization.deletionClassName;
            style = customization.deletionLineStyle;
        }
        var renderedLine = (_jsx("span", __assign({ className: className, style: style }, { children: line + '\r\n' }), output.length));
        return output.push(renderedLine);
    });
    return (_jsx("div", __assign({ className: customization.frameClassName, style: customization.frameStyle }, { children: _jsx("pre", { children: output }) })));
};
