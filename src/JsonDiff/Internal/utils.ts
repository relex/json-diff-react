// This is copied from 'json-diff' package ('lib/index.js') with minor
// modifications.

export const extendedTypeOf = function (obj: object): string {
  const result = typeof obj
  if (obj == null) {
    return 'null'
  } else if (result === 'object' && obj.constructor === Array) {
    return 'array'
  } else if (result === 'object' && obj instanceof Date) {
    return 'date'
  } else {
    return result
  }
}

export const roundObj = function (data: any, precision: number) {
  const type = typeof data
  if (type === 'object') {
    for (const key in data) {
      data[key] = roundObj(data[key], precision)
    }
    return data
  } else if (
    type === 'number' &&
    Number.isFinite(data) &&
    !Number.isInteger(data)
  ) {
    return +data.toFixed(precision)
  } else {
    return data
  }
}
