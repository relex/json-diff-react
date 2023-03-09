import { diffRender, JsonValue, DiffOptions, StyleCustomization } from './JsonDiff/Internal/index';

// Default style customization only sets class names to their default values.
const defaultStyleCustomization: StyleCustomization = {
  additionLineStyle: null,
  additionClassName: 'addition',
  deletionLineStyle: null,
  deletionClassName: 'deletion',
  unchangedLineStyle: null,
  unchangedClassName: 'unchanged',
  frameStyle: null,
  frameClassName: 'diff',
};

export function mkCustomization(customizations: Partial<StyleCustomization>): StyleCustomization {
  return { ...defaultStyleCustomization, ...customizations };
}

/**
 * React.js functional component for a structural JSON diff.
 *
 * @param {Object} props - properties of the component
 * @param {JsonValue} props.jsonA - parsed JSON value (fed to diff)
 * @param {JsonValue} props.jsonB - parsed JSON value (fed to diff)
 * @param {Partial<StyleCustomization>} props.styleCustomization
 * @param {DiffOptions} props.jsonDiffOptions - properties passed to json-diff
 */
export function JsonDiffComponent(props: {
  jsonA: JsonValue;
  jsonB: JsonValue;
  styleCustomization?: Partial<StyleCustomization>;
  jsonDiffOptions?: DiffOptions;
}): JSX.Element {
  return diffRender(
    props.jsonA,
    props.jsonB,
    props.jsonDiffOptions,
    mkCustomization(props.styleCustomization ?? {})
  );
}

// Re-export 'StyleCustomization' and 'DiffOptions'
export type { StyleCustomization, DiffOptions, JsonValue } from './JsonDiff/Internal/index';
