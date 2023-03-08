import { diffRender } from './JsonDiff/Internal/index';
// Default style customization only sets class names to their default values.
const defaultStyleCustomization = {
    additionLineStyle: null,
    additionClassName: 'addition',
    deletionLineStyle: null,
    deletionClassName: 'deletion',
    unchangedLineStyle: null,
    unchangedClassName: 'unchanged',
    frameStyle: null,
    frameClassName: 'diff',
};
export function mkCustomization(customizations) {
    return Object.assign(Object.assign({}, defaultStyleCustomization), customizations);
}
/**
 * React.js functional component for a structural JSON diff.
 *
 * @param {Object} props - properties of the component
 * @param {JsonValue} props.jsonA - parsed JSON value (fed to diff)
 * @param {JsonValue} props.jsonB - parsed JSON value (fed to diff)
 * @param {Partial<StyleCustomization>=} props.styleCustomization
 * @param {DiffOptions} props.jsonDiffOptions - properties passed to json-diff
 */
export function JsonDiffComponent(props) {
    var _a;
    return diffRender(props.jsonA, props.jsonB, props.jsonDiffOptions, mkCustomization((_a = props.styleCustomization) !== null && _a !== void 0 ? _a : {}));
}
