import { describe, expect } from '@jest/globals';
import renderer from 'react-test-renderer';

import React from 'react';

import { JsonDiffComponent } from './JsonDiffComponent';

//import { renderToStaticMarkup } from 'react-dom/server';

describe('<JsonDiffComponent />', () => {
  it('should return an empty div if there are no changes', () => {
    const tree = renderer
      .create(<JsonDiffComponent original="{}" latest="{}" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
