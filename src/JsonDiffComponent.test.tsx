import { describe, expect } from '@jest/globals';
import * as fc from 'fast-check';
import renderer from 'react-test-renderer';

import React from 'react';

import { JsonDiffComponent } from './JsonDiffComponent';


describe('<JsonDiffComponent />', () => {
  it('should return an empty div if there are no changes', () => {
    const onError = jest.fn();
    const tree = renderer
      .create(<JsonDiffComponent original="{}" latest="{}" onError={onError} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should return an empty div if there are no changes (property)', () => {
    fc.assert(
      fc.property(fc.json(), (json) => {
        const onError = jest.fn();
        const tree = renderer
          .create(<JsonDiffComponent original={json} latest={json} onError={onError} />)
          .toJSON();

        expect(tree).toMatchSnapshot();
        expect(onError).not.toHaveBeenCalled();
      })
    );
  });

  it('should not fail if inputs are JSON encoded', () => {
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

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
  } catch(e) {
    return false;
  }

  return true;
}
