import { describe, expect } from '@jest/globals';
import * as fc from 'fast-check';
import renderer from 'react-test-renderer';

import React from 'react';

import { JsonDiffComponent, StyleCustomization } from './JsonDiffComponent';

const runSnapshotTest = (
  original: string, 
  latest: string, 
  onError: (e: Error) => JSX.Element, 
  styleCustomization: Partial<StyleCustomization>
  ) => {

  const tree = renderer
    .create(
      <JsonDiffComponent 
        original={original} 
        latest={latest} 
        onError={onError} 
        styleCustomization={styleCustomization}
        />)
    .toJSON();

  expect(tree).toMatchSnapshot();
  expect(onError).not.toHaveBeenCalled();
}; 

const runSimpleSnapshotTest = (original: string, latest: string) => {
  runSnapshotTest(original, latest, jest.fn(), {});
};

describe('<JsonDiffComponent />', () => {
  it('it should render correctly (objects vs object)', () => {
    const original = {
      key1: "value1",
      key2: 123,
      key3: [1, 2, 3]
    };

    const latest = {
      key1: "value",
      key2: 123,
      key3: [1, 2, 3, 4]
    };
    
    runSimpleSnapshotTest(JSON.stringify(original), JSON.stringify(latest));
  });

  it('it should render correctly (array vs array)', () => {
    const original = [1, 2, 3];
    const latest = [1, 2, 3, 4];
    
    runSimpleSnapshotTest(JSON.stringify(original), JSON.stringify(latest));
  });

  it('it should render correctly (object vs array)', () => {
    const original = {
      key1: "value1",
      key2: 123,
      key3: [1, 2, 3]
    };
    const latest = [1, 2, 3, 4];
    
    runSimpleSnapshotTest(JSON.stringify(original), JSON.stringify(latest));
  });

  it('should pick up CSS classes from styleCustomization', () => {
    const original = { key1: "value1", key2: 123, key3: [1, 2, 3] };
    const latest = { key1: "value", key2: 123, key3: [1, 2, 3, 4] };

    const styleCustomization: Partial<StyleCustomization> = {
      additionClassName: "custom_addition_class",
      deletionClassName: "custom_deletion_class",
      unchangedClassName: "custom_unchanged_class",
      frameClassName: "custom_frame_class"
    }

    runSnapshotTest(
      JSON.stringify(original),
      JSON.stringify(latest),
      jest.fn(),
      styleCustomization 
    );
  });

  it('should pick up CSS styles from styleCustomization', () => {
    const original = { key1: "value1", key2: 123, key3: [1, 2, 3] };
    const latest = { key1: "value", key2: 123, key3: [1, 2, 3, 4] };

    const styleCustomization: Partial<StyleCustomization> = {
      additionLineStyle: { lineHeight: 1 },
      deletionLineStyle: { lineHeight: 2 },
      unchangedLineStyle: { lineHeight: 3 },
      frameStyle: { backgroundColor: "black" }
    }

    runSnapshotTest(
      JSON.stringify(original),
      JSON.stringify(latest),
      jest.fn(),
      styleCustomization 
    );
  });

  it('should return an empty div if there are no changes (snapshot)', () => {
    runSimpleSnapshotTest("{}", "{}");
  });

  it('should return an empty div if there are no changes (property)', () => {
    fc.assert(
      fc.property(fc.json(), (json) => {
        const onError = jest.fn();
        const tree = renderer
          .create(<JsonDiffComponent original={json} latest={json} onError={onError} />)
          .toJSON();

        expect(onError).not.toHaveBeenCalled();
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

  it('onError should not be called if both inputs are JSON encoded', () => {
    fc.assert(
      fc.property(fc.json(), fc.json(), (original, latest) => {
        const onError = jest.fn();
        renderer
          .create(<JsonDiffComponent original={original} latest={latest} onError={onError} />)
          .toJSON();

        expect(onError).not.toHaveBeenCalled();
      })
    );
  });

  it('onError should be called if either input is not valid JSON', () => {
    function isValidJSON(str: string): boolean {
      try {
        JSON.parse(str);
      } catch(e) {
        return false;
      }

      return true;
    }

    fc.assert(
      fc.property(fc.string(), fc.string(), (original, latest) => {
        fc.pre(!isValidJSON(original) || isValidJSON(latest)); 

        const onError = jest.fn();
        renderer
          .create(<JsonDiffComponent original={original} latest={latest} onError={onError} />)
          .toJSON();

        expect(onError).toHaveBeenCalled();
      })
    );
  });

});

