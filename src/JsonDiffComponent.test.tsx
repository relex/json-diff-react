import { describe, expect } from '@jest/globals';
import * as fc from 'fast-check';
import renderer from 'react-test-renderer';

import React from 'react';

import { JsonValue, JsonDiffComponent, StyleCustomization } from './JsonDiffComponent';

const runSnapshotTest = (
  jsonA: JsonValue,
  jsonB: JsonValue,
  styleCustomization: Partial<StyleCustomization>,
  inlineSnapshotWithElisions?: string,
  inlineSnapshotWithoutElisions?: string // Original json-diff behavior
) => {
  // Original json-diff behavior
  {
    const tree = renderer
      .create(
        <JsonDiffComponent
          jsonA={jsonA}
          jsonB={jsonB}
          styleCustomization={styleCustomization}
          jsonDiffOptions={{ showElisionsForObjects: false }}
        />
      )
      .toJSON();

    if (inlineSnapshotWithoutElisions != null) {
      expect(tree).toMatchInlineSnapshot(inlineSnapshotWithoutElisions);
    } else {
      expect(tree).toMatchSnapshot();
    }
  }

  // With elisions for objects
  {
    const tree = renderer
      .create(
        <JsonDiffComponent jsonA={jsonA} jsonB={jsonB} styleCustomization={styleCustomization} />
      )
      .toJSON();

    if (inlineSnapshotWithElisions != null) {
      expect(tree).toMatchInlineSnapshot(inlineSnapshotWithElisions);
    } else {
      expect(tree).toMatchSnapshot();
    }
  }
};

const runSimpleSnapshotTest = (jsonA: JsonValue, jsonB: JsonValue) => {
  runSnapshotTest(jsonA, jsonB, {});
};

describe('<JsonDiffComponent />', () => {
  it('it should render correctly (objects vs object)', () => {
    const jsonA = {
      key1: 'value1',
      key2: 123,
      key3: [1, 2, 3],
    };

    const jsonB = {
      key1: 'value',
      key2: 123,
      key3: [1, 2, 3, 4],
    };

    runSimpleSnapshotTest(jsonA, jsonB);
  });

  it('it should render correctly (array vs array)', () => {
    const jsonA = [1, 2, 3];
    const jsonB = [1, 2, 3, 4];

    runSimpleSnapshotTest(jsonA, jsonB);
  });

  it('it should render correctly (object vs array)', () => {
    const jsonA = {
      key1: 'value1',
      key2: 123,
      key3: [1, 2, 3],
    };
    const jsonB = [1, 2, 3, 4];

    runSimpleSnapshotTest(jsonA, jsonB);
  });

  it('should pick up CSS classes from styleCustomization', () => {
    const jsonA = { key1: 'value1', key2: 123, key3: [1, 2, 3] };
    const jsonB = { key1: 'value', key2: 123, key3: [1, 2, 3, 4] };

    const styleCustomization: Partial<StyleCustomization> = {
      additionClassName: 'custom_addition_class',
      deletionClassName: 'custom_deletion_class',
      unchangedClassName: 'custom_unchanged_class',
      frameClassName: 'custom_frame_class',
    };

    runSnapshotTest(jsonA, jsonB, styleCustomization);
  });

  it('should pick up CSS styles from styleCustomization', () => {
    const jsonA = { key1: 'value1', key2: 123, key3: [1, 2, 3] };
    const jsonB = { key1: 'value', key2: 123, key3: [1, 2, 3, 4] };

    const styleCustomization: Partial<StyleCustomization> = {
      additionLineStyle: { lineHeight: 1 },
      deletionLineStyle: { lineHeight: 2 },
      unchangedLineStyle: { lineHeight: 3 },
      frameStyle: { backgroundColor: 'black' },
    };

    runSnapshotTest(jsonA, jsonB, styleCustomization);
  });

  it('should return an empty div if there are no changes (snapshot)', () => {
    runSimpleSnapshotTest({}, {});
  });

  it('should return an empty div if there are no changes (property)', () => {
    fc.assert(
      fc.property(fc.json(), (json) => {
        const parsedJson = JSON.parse(json);

        const inlineSnapshot = `
          <div
            className="diff"
            style={null}
          />
        `;

        runSnapshotTest(parsedJson, parsedJson, {}, inlineSnapshot, inlineSnapshot);
      })
    );
  });
});
