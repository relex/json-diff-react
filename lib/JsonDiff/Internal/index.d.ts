/// <reference types="react" />
import * as JsonDiffTypes from 'json-diff';
import CSS from 'csstype';
export type StyleCustomization = {
    additionLineStyle: CSS.Properties;
    additionClassName: string;
    deletionLineStyle: CSS.Properties;
    deletionClassName: string;
    unchangedLineStyle: CSS.Properties;
    unchangedClassName: string;
    frameStyle: CSS.Properties;
    frameClassName: string;
};
export type DiffOptions = JsonDiffTypes.DiffOptions & {
    excludeKeys?: string[];
};
export type JsonValue = {
    [x: string]: JsonValue;
} | Array<JsonValue> | string | number | boolean | null;
export declare function diff(obj1: unknown, obj2: unknown, options?: DiffOptions): any;
export declare function diffRender(jsonA: JsonValue, jsonB: JsonValue, options: DiffOptions | undefined, customization: StyleCustomization): JSX.Element;
