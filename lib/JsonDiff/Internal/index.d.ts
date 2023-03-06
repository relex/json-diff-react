/// <reference types="react" />
import { DiffOptions } from 'json-diff';
import CSS from 'csstype';
export type { DiffOptions } from 'json-diff';
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
export declare function diff(obj1: unknown, obj2: unknown, options?: DiffOptions): any;
export declare function diffRender(obj1: unknown, obj2: unknown, options: DiffOptions | undefined, customization: StyleCustomization): JSX.Element;
