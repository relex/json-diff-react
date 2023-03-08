import { jsx as _jsx } from "react/jsx-runtime";
import { describe, expect } from '@jest/globals';
import * as fc from 'fast-check';
import renderer from 'react-test-renderer';
import { JsonDiffComponent } from './JsonDiffComponent';
var runSnapshotTest = function (original, latest, styleCustomization) {
    var tree = renderer
        .create(_jsx(JsonDiffComponent, { original: original, latest: latest, styleCustomization: styleCustomization }))
        .toJSON();
    expect(tree).toMatchSnapshot();
};
var runSimpleSnapshotTest = function (original, latest) {
    runSnapshotTest(original, latest, {});
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
        runSimpleSnapshotTest(original, latest);
    });
    it('it should render correctly (array vs array)', function () {
        var original = [1, 2, 3];
        var latest = [1, 2, 3, 4];
        runSimpleSnapshotTest(original, latest);
    });
    it('it should render correctly (object vs array)', function () {
        var original = {
            key1: 'value1',
            key2: 123,
            key3: [1, 2, 3],
        };
        var latest = [1, 2, 3, 4];
        runSimpleSnapshotTest(original, latest);
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
        runSnapshotTest(original, latest, styleCustomization);
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
        runSnapshotTest(original, latest, styleCustomization);
    });
    it('should return an empty div if there are no changes (snapshot)', function () {
        runSimpleSnapshotTest({}, {});
    });
    it('should return an empty div if there are no changes (property)', function () {
        fc.assert(fc.property(fc.json(), function (json) {
            var parsedJson = JSON.parse(json);
            var tree = renderer
                .create(_jsx(JsonDiffComponent, { original: parsedJson, latest: parsedJson }))
                .toJSON();
            expect(tree).toMatchInlineSnapshot("\n          <div>\n            <div\n              className=\"diff\"\n              style={{}}\n            >\n              <pre />\n            </div>\n          </div>\n        ");
        }));
    });
});
