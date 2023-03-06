export default class JsonDiff {
    constructor(options: any);
    options: any;
    isScalar(obj: any): boolean;
    objectDiff(obj1: any, obj2: any): {
        score: number;
        result: {};
        equal: boolean;
    };
    findMatchingObject(item: any, index: any, fuzzyOriginals: any): {
        score: any;
        key: string;
        indexDistance: number;
    } | null;
    scalarize(array: any, originals: any, fuzzyOriginals: any): any[];
    isScalarized(item: any, originals: any): boolean;
    descalarize(item: any, originals: any): any;
    arrayDiff(obj1: any, obj2: any): any;
    diff(obj1: any, obj2: any): any;
}
