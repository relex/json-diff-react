// This is copied from 'json-diff' package ('lib/index.js') with minor
// modifications.

export const extendedTypeOf = function (obj: object): string {
  const result = typeof obj;
  if (obj == null) {
    return 'null';
  } else if (result === 'object' && obj.constructor === Array) {
    return 'array';
  } else if (result === 'object' && obj instanceof Date) {
    return 'date';
  } else {
    return result;
  }
};

export const roundObj = function (data: any, precision: number) {
  const type = typeof data;
  if (type === 'object') {
    for (const key in data) {
      data[key] = roundObj(data[key], precision);
    }
    return data;
  } else if (type === 'number' && Number.isFinite(data) && !Number.isInteger(data)) {
    return +data.toFixed(precision);
  } else {
    return data;
  }
};

// A hacky marker for “...” elisions for object keys.
// This feature wasn’t present in the original “json-diff” library.
// A unique identifier used as a value for the “elisioned” object keys.
//
// Read more about “Symbol”s here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
export const elisionMarker = Symbol('json-diff-react--elision-marker');
