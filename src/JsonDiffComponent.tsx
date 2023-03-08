import { diffRender, JsonValue, DiffOptions, StyleCustomization } from './JsonDiff/Internal/index';
import React from 'react';

const defaultStyleCustomization: StyleCustomization = {
  additionLineStyle: {
    color: 'green',
    lineHeight: 0.5,
  },
  additionClassName: 'addition',
  deletionLineStyle: {
    color: 'red',
    lineHeight: 0.5,
  },
  deletionClassName: 'deletion',
  unchangedLineStyle: {
    lineHeight: 0.5,
  },
  unchangedClassName: 'unchanged',
  frameStyle: {},
  frameClassName: 'diff',
};

export function mkCustomization(customizations: Partial<StyleCustomization>): StyleCustomization {
  return { ...defaultStyleCustomization, ...customizations };
}

/**
 * React.js functional component for a structural JSON diff.
 *
 * @param {Object} props - properties of the component
 * @param {JsonValue} props.original - parsed JSON value
 * @param {JsonValue} props.latest - parsed JSON value
 * @param {Partial<StyleCustomization>=} props.styleCustomization
 * @param {DiffOptions} props.jsonDiffOptions - properties passed to json-diff
 */
export function JsonDiffComponent(props: {
  original: JsonValue;
  latest: JsonValue;
  styleCustomization?: Partial<StyleCustomization>;
  jsonDiffOptions?: DiffOptions;
}): JSX.Element {
  let actualCustomization = props.styleCustomization ?? {};
  let fullCustomization = mkCustomization(actualCustomization);

  let diffElement = diffRender(
    props.original,
    props.latest,
    props.jsonDiffOptions,
    fullCustomization
  );
  return <div>{diffElement}</div>;
}

// Re-export 'StyleCustomization' and 'DiffOptions'
export type { StyleCustomization, DiffOptions, JsonValue } from './JsonDiff/Internal/index';
