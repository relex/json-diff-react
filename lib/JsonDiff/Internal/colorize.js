import { jsx as _jsx } from "react/jsx-runtime";
// Copied from 'json-diff' with minor modifications.
//
// The 'colorize' function was adapted from console rendering to browser
// rendering - it now returns a JSX.Element.
import { extendedTypeOf, elisionMarker } from './utils';
import React from 'react';
const subcolorizeToCallback = function (options, key, diff, output, color, indent) {
    let subvalue;
    const prefix = key ? `${key}: ` : '';
    const subindent = indent + '  ';
    const outputElisions = (n) => {
        const maxElisions = options.maxElisions === undefined ? Infinity : options.maxElisions;
        if (n < maxElisions) {
            for (let i = 0; i < n; i++) {
                output(' ', subindent + '...');
            }
        }
        else {
            output(' ', subindent + `... (${n} entries)`);
        }
    };
    switch (extendedTypeOf(diff)) {
        case 'object':
            if ('__old' in diff && '__new' in diff && Object.keys(diff).length === 2) {
                subcolorizeToCallback(options, key, diff.__old, output, '-', indent);
                return subcolorizeToCallback(options, key, diff.__new, output, '+', indent);
            }
            else {
                output(color, `${indent}${prefix}{`);
                // Elisions are added in “json-diff” module depending on the option.
                let elisionCount = 0;
                for (const subkey of Object.keys(diff)) {
                    let m;
                    subvalue = diff[subkey];
                    // Handle elisions
                    if (subvalue === elisionMarker) {
                        elisionCount++;
                        continue;
                    }
                    else if (elisionCount > 0) {
                        outputElisions(1);
                        elisionCount = 0;
                    }
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
                // Handle elisions
                if (elisionCount > 0)
                    outputElisions(1);
                return output(color, `${indent}}`);
            }
        case 'array': {
            output(color, `${indent}${prefix}[`);
            let looksLikeDiff = true;
            for (const item of diff) {
                if (extendedTypeOf(item) !== 'array' ||
                    !(item.length === 2 || (item.length === 1 && item[0] === ' ')) ||
                    !(typeof item[0] === 'string') ||
                    item[0].length !== 1 ||
                    ![' ', '-', '+', '~'].includes(item[0])) {
                    looksLikeDiff = false;
                }
            }
            if (looksLikeDiff) {
                let op;
                let elisionCount = 0;
                for ([op, subvalue] of diff) {
                    if (op === ' ' && subvalue == null) {
                        elisionCount++;
                    }
                    else {
                        if (elisionCount > 0) {
                            outputElisions(elisionCount);
                        }
                        elisionCount = 0;
                        if (![' ', '~', '+', '-'].includes(op)) {
                            throw new Error(`Unexpected op '${op}' in ${JSON.stringify(diff, null, 2)}`);
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
                for (subvalue of diff) {
                    subcolorizeToCallback(options, '', subvalue, output, color, subindent);
                }
            }
            return output(color, `${indent}]`);
        }
        default:
            if (diff === 0 || diff === null || diff === false || diff === '' || diff) {
                return output(color, indent + prefix + JSON.stringify(diff));
            }
    }
};
const colorizeToCallback = (diff, options, output) => subcolorizeToCallback(options, '', diff, output, ' ', '');
export const colorize = function (diff, options = {}, customization) {
    const output = [];
    colorizeToCallback(diff, options, function (color, line) {
        let className;
        let style;
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
        let renderedLine = (_jsx("div", Object.assign({ className: className, style: style }, { children: line }), output.length));
        return output.push(renderedLine);
    });
    return (_jsx("div", Object.assign({ className: customization.frameClassName, style: customization.frameStyle }, { children: output })));
};
