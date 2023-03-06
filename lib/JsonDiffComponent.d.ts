/// <reference types="react" />
import { DiffOptions, StyleCustomization } from './JsonDiff/Internal/index';
export declare function mkCustomization(customizations: Partial<StyleCustomization>): StyleCustomization;
export declare function JsonDiffComponent({ original, latest, onError, styleCustomization, jsonDiffOptions, }: {
    original: string;
    latest: string;
    onError: (e: Error) => JSX.Element;
    styleCustomization?: Partial<StyleCustomization>;
    jsonDiffOptions?: DiffOptions;
}): JSX.Element;
export type { StyleCustomization, DiffOptions } from './JsonDiff/Internal/index';
