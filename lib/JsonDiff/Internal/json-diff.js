// This is copied from 'json-diff' package ('lib/index.js') with minor
// modifications.
import { extendedTypeOf } from './utils';
import { SequenceMatcher } from '@ewoudenberg/difflib';
var JsonDiff = /** @class */ (function () {
    function JsonDiff(options) {
        options.outputKeys = options.outputKeys || [];
        options.excludeKeys = options.excludeKeys || [];
        this.options = options;
    }
    JsonDiff.prototype.isScalar = function (obj) {
        return typeof obj !== 'object' || obj === null;
    };
    JsonDiff.prototype.objectDiff = function (obj1, obj2) {
        var result = {};
        var score = 0;
        var equal = true;
        for (var _i = 0, _a = Object.entries(obj1); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (!this.options.outputNewOnly) {
                var postfix = '__deleted';
                if (!(key in obj2) && !this.options.excludeKeys.includes(key)) {
                    result["".concat(key).concat(postfix)] = value;
                    score -= 30;
                    equal = false;
                }
            }
        }
        for (var _c = 0, _d = Object.entries(obj2); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            var postfix = !this.options.outputNewOnly ? '__added' : '';
            if (!(key in obj1) && !this.options.excludeKeys.includes(key)) {
                result["".concat(key).concat(postfix)] = value;
                score -= 30;
                equal = false;
            }
        }
        for (var _f = 0, _g = Object.entries(obj1); _f < _g.length; _f++) {
            var _h = _g[_f], key = _h[0], value1 = _h[1];
            if (key in obj2) {
                if (this.options.excludeKeys.includes(key)) {
                    continue;
                }
                score += 20;
                var value2 = obj2[key];
                var change = this.diff(value1, value2);
                if (!change.equal) {
                    result[key] = change.result;
                    equal = false;
                }
                else if (this.options.full || this.options.outputKeys.includes(key)) {
                    result[key] = value1;
                }
                // console.log(`key ${key} change.score=${change.score} ${change.result}`)
                score += Math.min(20, Math.max(-10, change.score / 5)); // BATMAN!
            }
        }
        if (equal) {
            score = 100 * Math.max(Object.keys(obj1).length, 0.5);
            if (!this.options.full) {
                result = undefined;
            }
        }
        else {
            score = Math.max(0, score);
        }
        // console.log(`objectDiff(${JSON.stringify(obj1, null, 2)} <=> ${JSON.stringify(obj2, null, 2)}) == ${JSON.stringify({score, result, equal})}`)
        return { score: score, result: result, equal: equal };
    };
    JsonDiff.prototype.findMatchingObject = function (item, index, fuzzyOriginals) {
        // console.log("findMatchingObject: " + JSON.stringify({item, fuzzyOriginals}, null, 2))
        var bestMatch = null;
        for (var _i = 0, _a = Object.entries(fuzzyOriginals); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], _c = _b[1], candidate = _c.item, matchIndex = _c.index;
            if (key !== '__next') {
                var indexDistance = Math.abs(matchIndex - index);
                if (extendedTypeOf(item) === extendedTypeOf(candidate)) {
                    var score = this.diff(item, candidate).score;
                    if (!bestMatch ||
                        score > bestMatch.score ||
                        (score === bestMatch.score && indexDistance < bestMatch.indexDistance)) {
                        bestMatch = { score: score, key: key, indexDistance: indexDistance };
                    }
                }
            }
        }
        // console.log"findMatchingObject result = " + JSON.stringify(bestMatch, null, 2)
        return bestMatch;
    };
    JsonDiff.prototype.scalarize = function (array, originals, fuzzyOriginals) {
        var fuzzyMatches = [];
        if (fuzzyOriginals) {
            // Find best fuzzy match for each object in the array
            var keyScores = {};
            for (var index = 0; index < array.length; index++) {
                var item = array[index];
                if (this.isScalar(item)) {
                    continue;
                }
                var bestMatch = this.findMatchingObject(item, index, fuzzyOriginals);
                if (bestMatch &&
                    (!keyScores[bestMatch.key] || bestMatch.score > keyScores[bestMatch.key].score)) {
                    keyScores[bestMatch.key] = { score: bestMatch.score, index: index };
                }
            }
            for (var _i = 0, _a = Object.entries(keyScores); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], match = _b[1];
                fuzzyMatches[match.index] = key;
            }
        }
        var result = [];
        for (var index = 0; index < array.length; index++) {
            var item = array[index];
            if (this.isScalar(item)) {
                result.push(item);
            }
            else {
                var key = fuzzyMatches[index] || '__$!SCALAR' + originals.__next++;
                originals[key] = { item: item, index: index };
                result.push(key);
            }
        }
        return result;
    };
    JsonDiff.prototype.isScalarized = function (item, originals) {
        return typeof item === 'string' && item in originals;
    };
    JsonDiff.prototype.descalarize = function (item, originals) {
        if (this.isScalarized(item, originals)) {
            return originals[item].item;
        }
        else {
            return item;
        }
    };
    JsonDiff.prototype.arrayDiff = function (obj1, obj2) {
        var originals1 = { __next: 1 };
        var seq1 = this.scalarize(obj1, originals1);
        var originals2 = { __next: originals1.__next };
        var seq2 = this.scalarize(obj2, originals2, originals1);
        if (this.options.sort) {
            seq1.sort();
            seq2.sort();
        }
        var opcodes = new SequenceMatcher(null, seq1, seq2).getOpcodes();
        // console.log(`arrayDiff:\nobj1 = ${JSON.stringify(obj1, null, 2)}\nobj2 = ${JSON.stringify(obj2, null, 2)}\nseq1 = ${JSON.stringify(seq1, null, 2)}\nseq2 = ${JSON.stringify(seq2, null, 2)}\nopcodes = ${JSON.stringify(opcodes, null, 2)}`)
        var result = [];
        var score = 0;
        var equal = true;
        for (var _i = 0, opcodes_1 = opcodes; _i < opcodes_1.length; _i++) {
            var _a = opcodes_1[_i], op = _a[0], i1 = _a[1], i2 = _a[2], j1 = _a[3], j2 = _a[4];
            var i = void 0, j = void 0;
            var asc = void 0, end = void 0;
            var asc1 = void 0, end1 = void 0;
            var asc2 = void 0, end2 = void 0;
            if (!(op === 'equal' || (this.options.keysOnly && op === 'replace'))) {
                equal = false;
            }
            switch (op) {
                case 'equal':
                    for (i = i1, end = i2, asc = i1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                        var item = seq1[i];
                        if (this.isScalarized(item, originals1)) {
                            if (!this.isScalarized(item, originals2)) {
                                throw new Error("internal bug: isScalarized(item, originals1) != isScalarized(item, originals2) for item ".concat(JSON.stringify(item)));
                            }
                            var item1 = this.descalarize(item, originals1);
                            var item2 = this.descalarize(item, originals2);
                            var change = this.diff(item1, item2);
                            if (!change.equal) {
                                result.push(['~', change.result]);
                                equal = false;
                            }
                            else {
                                if (this.options.full || this.options.keepUnchangedValues) {
                                    result.push([' ', item1]);
                                }
                                else {
                                    result.push([' ']);
                                }
                            }
                        }
                        else {
                            if (this.options.full || this.options.keepUnchangedValues) {
                                result.push([' ', item]);
                            }
                            else {
                                result.push([' ']);
                            }
                        }
                        score += 10;
                    }
                    break;
                case 'delete':
                    for (i = i1, end1 = i2, asc1 = i1 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
                        result.push(['-', this.descalarize(seq1[i], originals1)]);
                        score -= 5;
                    }
                    break;
                case 'insert':
                    for (j = j1, end2 = j2, asc2 = j1 <= end2; asc2 ? j < end2 : j > end2; asc2 ? j++ : j--) {
                        result.push(['+', this.descalarize(seq2[j], originals2)]);
                        score -= 5;
                    }
                    break;
                case 'replace':
                    if (!this.options.keysOnly) {
                        var asc3 = void 0, end3 = void 0;
                        var asc4 = void 0, end4 = void 0;
                        for (i = i1, end3 = i2, asc3 = i1 <= end3; asc3 ? i < end3 : i > end3; asc3 ? i++ : i--) {
                            result.push(['-', this.descalarize(seq1[i], originals1)]);
                            score -= 5;
                        }
                        for (j = j1, end4 = j2, asc4 = j1 <= end4; asc4 ? j < end4 : j > end4; asc4 ? j++ : j--) {
                            result.push(['+', this.descalarize(seq2[j], originals2)]);
                            score -= 5;
                        }
                    }
                    else {
                        var asc5 = void 0, end5 = void 0;
                        for (i = i1, end5 = i2, asc5 = i1 <= end5; asc5 ? i < end5 : i > end5; asc5 ? i++ : i--) {
                            var change = this.diff(this.descalarize(seq1[i], originals1), this.descalarize(seq2[i - i1 + j1], originals2));
                            if (!change.equal) {
                                result.push(['~', change.result]);
                                equal = false;
                            }
                            else {
                                result.push([' ']);
                            }
                        }
                    }
                    break;
            }
        }
        if (equal || opcodes.length === 0) {
            if (!this.options.full) {
                result = undefined;
            }
            else {
                result = obj1;
            }
            score = 100;
        }
        else {
            score = Math.max(0, score);
        }
        return { score: score, result: result, equal: equal };
    };
    JsonDiff.prototype.diff = function (obj1, obj2) {
        var type1 = extendedTypeOf(obj1);
        var type2 = extendedTypeOf(obj2);
        if (type1 === type2) {
            switch (type1) {
                case 'object':
                    return this.objectDiff(obj1, obj2);
                case 'array':
                    return this.arrayDiff(obj1, obj2);
            }
        }
        // Compare primitives or complex objects of different types
        var score = 100;
        var result = obj1;
        var equal;
        if (!this.options.keysOnly) {
            if (type1 === 'date' && type2 === 'date') {
                equal = obj1.getTime() === obj2.getTime();
            }
            else {
                equal = obj1 === obj2;
            }
            if (!equal) {
                score = 0;
                if (this.options.outputNewOnly) {
                    result = obj2;
                }
                else {
                    result = { __old: obj1, __new: obj2 };
                }
            }
            else if (!this.options.full) {
                result = undefined;
            }
        }
        else {
            equal = true;
            result = undefined;
        }
        return { score: score, result: result, equal: equal };
    };
    return JsonDiff;
}());
export default JsonDiff;
