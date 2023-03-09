/// <reference types="react" />
import { JsonValue, DiffOptions, StyleCustomization } from './JsonDiff/Internal/index';
export declare function mkCustomization(customizations: Partial<StyleCustomization>): StyleCustomization;
/**
 * React.js functional component for a structural JSON diff.
 *
 * @param {Object} props - properties of the component
 * @param {JsonValue} props.jsonA - parsed JSON value (fed to diff)
 * @param {JsonValue} props.jsonB - parsed JSON value (fed to diff)
 * @param {Partial<StyleCustomization>} props.styleCustomization
 * @param {DiffOptions} props.jsonDiffOptions - properties passed to json-diff
 */
export declare function JsonDiffComponent(props: {
    jsonA: JsonValue;
    jsonB: JsonValue;
    styleCustomization?: Partial<StyleCustomization>;
    jsonDiffOptions?: DiffOptions;
}): JSX.Element;
export type { StyleCustomization, DiffOptions, JsonValue } from './JsonDiff/Internal/index';
