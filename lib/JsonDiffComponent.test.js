import { jsx as _jsx } from "react/jsx-runtime";
import { describe, expect } from '@jest/globals';
import * as fc from 'fast-check';
import renderer from 'react-test-renderer';
import { JsonDiffComponent } from './JsonDiffComponent';
var runSnapshotTest = function (original, latest, onError, styleCustomization) {
    var tree = renderer
        .create(_jsx(JsonDiffComponent, { original: original, latest: latest, onError: onError, styleCustomization: styleCustomization }))
        .toJSON();
    expect(tree).toMatchSnapshot();
    expect(onError).not.toHaveBeenCalled();
};
var runSimpleSnapshotTest = function (original, latest) {
    runSnapshotTest(original, latest, jest.fn(), {});
};
describe('<JsonDiffComponent />', function () {
    it('it should render correctly (objects vs object)', function () {
        var original = {
            key1: 'value1',
            key2: 123,
            key3: [1, 2, 3],
        };
        var latest = {
            key1: 'value',
            key2: 123,
            key3: [1, 2, 3, 4],
        };
        runSimpleSnapshotTest(JSON.stringify(original), JSON.stringify(latest));
    });
    it('it should render correctly (array vs array)', function () {
        var original = [1, 2, 3];
        var latest = [1, 2, 3, 4];
        runSimpleSnapshotTest(JSON.stringify(original), JSON.stringify(latest));
    });
    it('it should render correctly (object vs array)', function () {
        var original = {
            key1: 'value1',
            key2: 123,
            key3: [1, 2, 3],
        };
        var latest = [1, 2, 3, 4];
        runSimpleSnapshotTest(JSON.stringify(original), JSON.stringify(latest));
    });
    it('should pick up CSS classes from styleCustomization', function () {
        var original = { key1: 'value1', key2: 123, key3: [1, 2, 3] };
        var latest = { key1: 'value', key2: 123, key3: [1, 2, 3, 4] };
        var styleCustomization = {
            additionClassName: 'custom_addition_class',
            deletionClassName: 'custom_deletion_class',
            unchangedClassName: 'custom_unchanged_class',
            frameClassName: 'custom_frame_class',
        };
        runSnapshotTest(JSON.stringify(original), JSON.stringify(latest), jest.fn(), styleCustomization);
    });
    it('should pick up CSS styles from styleCustomization', function () {
        var original = { key1: 'value1', key2: 123, key3: [1, 2, 3] };
        var latest = { key1: 'value', key2: 123, key3: [1, 2, 3, 4] };
        var styleCustomization = {
            additionLineStyle: { lineHeight: 1 },
            deletionLineStyle: { lineHeight: 2 },
            unchangedLineStyle: { lineHeight: 3 },
            frameStyle: { backgroundColor: 'black' },
        };
        runSnapshotTest(JSON.stringify(original), JSON.stringify(latest), jest.fn(), styleCustomization);
    });
    it('should return an empty div if there are no changes (snapshot)', function () {
        runSimpleSnapshotTest('{}', '{}');
    });
    it('should return an empty div if there are no changes (property)', function () {
        fc.assert(fc.property(fc.json(), function (json) {
            var onError = jest.fn();
            var tree = renderer
                .create(_jsx(JsonDiffComponent, { original: json, latest: json, onError: onError }))
                .toJSON();
            expect(onError).not.toHaveBeenCalled();
            expect(tree).toMatchInlineSnapshot("\n          <div>\n            <div\n              className=\"diff\"\n              style={{}}\n            >\n              <pre />\n            </div>\n          </div>\n        ");
        }));
    });
    it('onError should not be called if both inputs are JSON encoded', function () {
        fc.assert(fc.property(fc.json(), fc.json(), function (original, latest) {
            var onError = jest.fn();
            renderer
                .create(_jsx(JsonDiffComponent, { original: original, latest: latest, onError: onError }))
                .toJSON();
            expect(onError).not.toHaveBeenCalled();
        }));
    });
    it('onError should be called if either input is not valid JSON', function () {
        function isValidJSON(str) {
            try {
                JSON.parse(str);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        fc.assert(fc.property(fc.string(), fc.string(), function (original, latest) {
            fc.pre(!isValidJSON(original) || isValidJSON(latest));
            var onError = jest.fn();
            renderer
                .create(_jsx(JsonDiffComponent, { original: original, latest: latest, onError: onError }))
                .toJSON();
            expect(onError).toHaveBeenCalled();
        }));
    });
});
