import { describe, expect } from '@jest/globals';
import * as fc from 'fast-check';
import renderer from 'react-test-renderer';

import React from 'react';

import { JsonValue, JsonDiffComponent, StyleCustomization } from './JsonDiffComponent';

const runSnapshotTest = (
  original: JsonValue,
  latest: JsonValue,
  styleCustomization: Partial<StyleCustomization>
) => {
  const tree = renderer
    .create(
      <JsonDiffComponent
        original={original}
        latest={latest}
        styleCustomization={styleCustomization}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
};

const runSimpleSnapshotTest = (original: JsonValue, latest: JsonValue) => {
  runSnapshotTest(original, latest, {});
};

describe('<JsonDiffComponent />', () => {
  it('it should render correctly (objects vs object)', () => {
    const original = {
      key1: 'value1',
      key2: 123,
      key3: [1, 2, 3],
    };

    const latest = {
      key1: 'value',
      key2: 123,
      key3: [1, 2, 3, 4],
    };

    runSimpleSnapshotTest(original, latest);
  });

  it('it should render correctly (array vs array)', () => {
    const original = [1, 2, 3];
    const latest = [1, 2, 3, 4];

    runSimpleSnapshotTest(original, latest);
  });

  it('it should render correctly (object vs array)', () => {
    const original = {
      key1: 'value1',
      key2: 123,
      key3: [1, 2, 3],
    };
    const latest = [1, 2, 3, 4];

    runSimpleSnapshotTest(original, latest);
  });

  it('should pick up CSS classes from styleCustomization', () => {
    const original = { key1: 'value1', key2: 123, key3: [1, 2, 3] };
    const latest = { key1: 'value', key2: 123, key3: [1, 2, 3, 4] };

    const styleCustomization: Partial<StyleCustomization> = {
      additionClassName: 'custom_addition_class',
      deletionClassName: 'custom_deletion_class',
      unchangedClassName: 'custom_unchanged_class',
      frameClassName: 'custom_frame_class',
    };

    runSnapshotTest(original, latest, styleCustomization);
  });

  it('should pick up CSS styles from styleCustomization', () => {
    const original = { key1: 'value1', key2: 123, key3: [1, 2, 3] };
    const latest = { key1: 'value', key2: 123, key3: [1, 2, 3, 4] };

    const styleCustomization: Partial<StyleCustomization> = {
      additionLineStyle: { lineHeight: 1 },
      deletionLineStyle: { lineHeight: 2 },
      unchangedLineStyle: { lineHeight: 3 },
      frameStyle: { backgroundColor: 'black' },
    };

    runSnapshotTest(original, latest, styleCustomization);
  });

  it('should return an empty div if there are no changes (snapshot)', () => {
    runSimpleSnapshotTest({}, {});
  });

  it('should return an empty div if there are no changes (property)', () => {
    fc.assert(
      fc.property(fc.json(), (json) => {
        const parsedJson = JSON.parse(json);
        const tree = renderer
          .create(<JsonDiffComponent original={parsedJson} latest={parsedJson} />)
          .toJSON();

        expect(tree).toMatchInlineSnapshot(`
          <div>
            <div
              className="diff"
              style={{}}
            >
              <pre />
            </div>
          </div>
        `);
      })
    );
  });
});
