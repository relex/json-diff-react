// The original unit tests in 'json-diff' were written in CoffeeScript.
//
// These are those original unit tests converted to JS/TS with the tests for
// 'diffString' removed because that function no longer exists.
//
// In this fork of the 'json-diff' library, the 'diffString' function was
// replaced by 'diffRender' which returns a JSX Element. The functionality of
// 'diffRender' is tested indirectly in 'JsonDiffComponent.test.tsx'.

import { diff as originalDiff } from './index';
const assert = require('assert');

export {};

// Original “diff” behavior from json-diff library.
const diff = (a, b, options) => originalDiff(a, b, { showElisionsForObjects: false, ...options });

describe('diff', function () {
  describe('with simple scalar values', function () {
    it('should return undefined for two identical numbers', function () {
      return assert.deepEqual(void 0, diff(42, 42));
    });
    it('should return undefined for two identical strings', function () {
      return assert.deepEqual(void 0, diff('foo', 'foo'));
    });
    it('should return undefined for two identical dates', function () {
      var date;
      date = new Date();
      return assert.deepEqual(void 0, diff(date, date));
    });
    it('should return { __old: <old value>, __new: <new value> } object for two different numbers', function () {
      return assert.deepEqual(
        {
          __old: 42,
          __new: 10,
        },
        diff(42, 10)
      );
    });
    return it('should return { __old: <old value>, __new: <new value> } object for two different dates', function () {
      var newDate, oldDate;
      oldDate = new Date();
      newDate = new Date();
      newDate.setFullYear(oldDate.getFullYear() - 4);
      return assert.deepEqual(
        {
          __old: oldDate,
          __new: newDate,
        },
        diff(oldDate, newDate)
      );
    });
  });
  describe('with objects', function () {
    it('should return undefined for two empty objects', function () {
      return assert.deepEqual(void 0, diff({}, {}));
    });
    it('should return undefined for two objects with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {
            foo: 42,
            bar: 10,
          },
          {
            foo: 42,
            bar: 10,
          }
        )
      );
    });
    it('should return undefined for two object hierarchies with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          }
        )
      );
    });
    it('should return { <key>__deleted: <old value> } when the second object is missing a key', function () {
      return assert.deepEqual(
        {
          foo__deleted: 42,
        },
        diff(
          {
            foo: 42,
            bar: 10,
          },
          {
            bar: 10,
          }
        )
      );
    });
    it('should return { <key>__added: <new value> } when the first object is missing a key', function () {
      return assert.deepEqual(
        {
          foo__added: 42,
        },
        diff(
          {
            bar: 10,
          },
          {
            foo: 42,
            bar: 10,
          }
        )
      );
    });
    it('should return { <key>: { __old: <old value>, __new: <new value> } } for two objects with different scalar values for a key', function () {
      return assert.deepEqual(
        {
          foo: {
            __old: 42,
            __new: 10,
          },
        },
        diff(
          {
            foo: 42,
          },
          {
            foo: 10,
          }
        )
      );
    });
    return it('should return { <key>: <diff> } with a recursive diff for two objects with different values for a key', function () {
      return assert.deepEqual(
        {
          bar: {
            bbboz__deleted: 11,
            bbbar: {
              __old: 10,
              __new: 12,
            },
          },
        },
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 12,
            },
          }
        )
      );
    });
  });
  describe('with arrays of scalars', function () {
    it('should return undefined for two arrays with identical contents', function () {
      return assert.deepEqual(void 0, diff([10, 20, 30], [10, 20, 30]));
    });
    it("should return [..., ['-', <removed item>], ...] for two arrays when the second array is missing a value", function () {
      return assert.deepEqual([[' '], ['-', 20], [' ']], diff([10, 20, 30], [10, 30]));
    });
    it("should return [..., ['+', <added item>], ...] for two arrays when the second one has an extra value", function () {
      return assert.deepEqual([[' '], ['+', 20], [' ']], diff([10, 30], [10, 20, 30]));
    });
    it("should return [..., ['+', <added item>]] for two arrays when the second one has an extra value at the end (edge case test)", function () {
      return assert.deepEqual([[' '], [' '], ['+', 30]], diff([10, 20], [10, 20, 30]));
    });
    return it("should return [['-', true],  ['+', 'true']] for two arrays with identical strings of different types", function () {
      return assert.deepEqual(void 0, diff([10, 20, 30], [10, 20, 30]));
    });
  });
  describe('with arrays of objects', function () {
    it('should return undefined for two arrays with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ]
        )
      );
    });
    it('should return undefined for two arrays with identical, empty object contents', function () {
      return assert.deepEqual(void 0, diff([{}], [{}]));
    });
    it('should return undefined for two arrays with identical, empty array contents', function () {
      return assert.deepEqual(void 0, diff([[]], [[]]));
    });
    it("should return undefined for two arrays with identical array contents including 'null'", function () {
      return assert.deepEqual(void 0, diff([1, null, null], [1, null, null]));
    });
    it('should return undefined for two arrays with identical, repeated contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            {
              a: 1,
              b: 2,
            },
            {
              a: 1,
              b: 2,
            },
          ],
          [
            {
              a: 1,
              b: 2,
            },
            {
              a: 1,
              b: 2,
            },
          ]
        )
      );
    });
    it("should return [..., ['-', <removed item>], ...] for two arrays when the second array is missing a value", function () {
      return assert.deepEqual(
        [
          [' '],
          [
            '-',
            {
              foo: 20,
            },
          ],
          [' '],
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 30,
            },
          ]
        )
      );
    });
    it("should return [..., ['+', <added item>], ...] for two arrays when the second array has an extra value", function () {
      return assert.deepEqual(
        [
          [' '],
          [
            '+',
            {
              foo: 20,
            },
          ],
          [' '],
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ]
        )
      );
    });
    it("should return [['+', <added item>], ..., ['+', <added item>]] for two arrays containing objects of 3 or more properties when the second array has extra values (fixes issue #57)", function () {
      return assert.deepEqual(
        [
          [
            '+',
            {
              key1: 'b',
              key2: '1',
              key3: 'm',
            },
          ],
          [' '],
          [
            '+',
            {
              key1: 'c',
              key2: '1',
              key3: 'dm',
            },
          ],
        ],
        diff(
          [
            {
              key1: 'a',
              key2: '12',
              key3: 'cm',
            },
          ],
          [
            {
              key1: 'b',
              key2: '1',
              key3: 'm',
            },
            {
              key1: 'a',
              key2: '12',
              key3: 'cm',
            },
            {
              key1: 'c',
              key2: '1',
              key3: 'dm',
            },
          ]
        )
      );
    });
    it("should return [..., ['+', <added item>], ...] for two arrays when the second array has a new but nearly identical object added", function () {
      return assert.deepEqual(
        [
          [' '],
          [
            '+',
            {
              name: 'Foo',
              a: 3,
              b: 1,
              c: 1,
            },
          ],
          [' '],
        ],
        diff(
          [
            {
              name: 'Foo',
              a: 3,
              b: 1,
            },
            {
              foo: 10,
            },
          ],
          [
            {
              name: 'Foo',
              a: 3,
              b: 1,
            },
            {
              name: 'Foo',
              a: 3,
              b: 1,
              c: 1,
            },
            {
              foo: 10,
            },
          ]
        )
      );
    });
    return it("should return [..., ['~', <diff>], ...] for two arrays when an item has been modified", function () {
      return assert.deepEqual(
        [
          [' '],
          [
            '~',
            {
              foo: {
                __old: 20,
                __new: 21,
              },
            },
          ],
          [' '],
        ],
        diff(
          [
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
            {
              foo: 20,
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ],
          [
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
            {
              foo: 21,
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ]
        )
      );
    });
  });
  return describe('with reported bugs', function () {
    it('should handle type mismatch during scalarize', function () {
      return assert.deepEqual(
        {
          s: [
            [
              '~',
              [
                [
                  '~',
                  {
                    b: {
                      __old: '123',
                      __new: 'abc',
                    },
                  },
                ],
              ],
            ],
            ['+', []],
          ],
        },
        diff(
          {
            s: [
              [
                {
                  b: '123',
                },
              ],
            ],
          },
          {
            s: [
              [
                {
                  b: 'abc',
                },
              ],
              [],
            ],
          }
        )
      );
    });
    return it('should handle mixed scalars and non-scalars in scalarize', function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            'a',
            {
              foo: 'bar',
            },
            {
              foo: 'bar',
            },
          ],
          [
            'a',
            {
              foo: 'bar',
            },
            {
              foo: 'bar',
            },
          ]
        )
      );
    });
  });
});

describe('diff({sort: true})', function () {
  return describe('with arrays', function () {
    return it('should return undefined for two arrays with the same contents in different order', function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            1,
            void 0,
            null,
            true,
            '',
            {
              a: 4,
            },
            [7, 8],
          ],
          [
            [7, 8],
            {
              a: 4,
            },
            true,
            null,
            void 0,
            '',
            1,
          ],
          {
            sort: true,
          }
        )
      );
    });
  });
});

describe('diff({keepUnchangedValues: true})', function () {
  return describe('with nested object', function () {
    return it('should return partial object with modified and unmodified elements in the edited scope', function () {
      return assert.deepEqual(
        {
          a: {
            b: [
              [' ', 1],
              ['-', 2],
              [' ', 3],
              ['+', 4],
            ],
          },
        },
        diff(
          {
            a: {
              b: [1, 2, 3],
              c: 'd',
            },
          },
          {
            a: {
              b: [1, 3, 4],
              c: 'd',
            },
          },
          {
            keepUnchangedValues: true,
          }
        )
      );
    });
  });
});

describe('diff({full: true})', function () {
  describe('with simple scalar values', function () {
    it('should return the number for two identical numbers', function () {
      return assert.deepEqual(
        42,
        diff(42, 42, {
          full: true,
        })
      );
    });
    it('should return the string for two identical strings', function () {
      return assert.deepEqual(
        'foo',
        diff('foo', 'foo', {
          full: true,
        })
      );
    });
    return it('should return { __old: <old value>, __new: <new value> } object for two different numbers', function () {
      return assert.deepEqual(
        {
          __new: 10,
          __old: 42,
        },
        diff(42, 10, {
          full: true,
        })
      );
    });
  });
  describe('with objects', function () {
    it('should return an empty object for two empty objects', function () {
      return assert.deepEqual(
        {},
        diff(
          {},
          {},
          {
            full: true,
          }
        )
      );
    });
    it('should return the object for two objects with identical contents', function () {
      return assert.deepEqual(
        {
          foo: 42,
          bar: 10,
        },
        diff(
          {
            foo: 42,
            bar: 10,
          },
          {
            foo: 42,
            bar: 10,
          },
          {
            full: true,
          }
        )
      );
    });
    it('should return the object for two object hierarchies with identical contents', function () {
      return assert.deepEqual(
        {
          foo: 42,
          bar: {
            bbbar: 10,
            bbboz: 11,
          },
        },
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            full: true,
          }
        )
      );
    });
    it('should return { <key>__deleted: <old value>, <remaining properties>} when the second object is missing a key', function () {
      return assert.deepEqual(
        {
          foo__deleted: 42,
          bar: 10,
        },
        diff(
          {
            foo: 42,
            bar: 10,
          },
          {
            bar: 10,
          },
          {
            full: true,
          }
        )
      );
    });
    it('should return { <key>__added: <new value>, <remaining properties> } when the first object is missing a key', function () {
      return assert.deepEqual(
        {
          foo__added: 42,
          bar: 10,
        },
        diff(
          {
            bar: 10,
          },
          {
            foo: 42,
            bar: 10,
          },
          {
            full: true,
          }
        )
      );
    });
    it('should return { <key>: { __old: <old value>, __new: <new value> } } for two objects with different scalar values for a key', function () {
      return assert.deepEqual(
        {
          foo: {
            __old: 42,
            __new: 10,
          },
        },
        diff(
          {
            foo: 42,
          },
          {
            foo: 10,
          },
          {
            full: true,
          }
        )
      );
    });
    it('should return { <key>: <diff>, <equal properties> } with a recursive diff for two objects with different values for a key', function () {
      return assert.deepEqual(
        {
          foo: 42,
          bar: {
            bbbar: {
              __old: 10,
              __new: 12,
            },
          },
        },
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 12,
            },
          },
          {
            full: true,
          }
        )
      );
    });
    return it('should return { <key>: <diff>, <equal properties> } with a recursive diff for two objects with different values for a key', function () {
      return assert.deepEqual(
        {
          foo: 42,
          bar: {
            bbboz__deleted: 11,
            bbbar: {
              __old: 10,
              __new: 12,
            },
          },
        },
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 12,
            },
          },
          {
            full: true,
          }
        )
      );
    });
  });
  describe('with arrays of scalars', function () {
    it('should return an array showing no changes for any element for two arrays with identical contents', function () {
      return assert.deepEqual(
        [10, 20, 30],
        diff([10, 20, 30], [10, 20, 30], {
          full: true,
        })
      );
    });
    it("should return [[' ', <unchanged item>], ['-', <removed item>], [' ', <unchanged item>]] for two arrays when the second array is missing a value", function () {
      return assert.deepEqual(
        [
          [' ', 10],
          ['-', 20],
          ['+', 42],
          [' ', 30],
        ],
        diff([10, 20, 30], [10, 42, 30], {
          full: true,
        })
      );
    });
    it("should return [' ', <unchanged item>], ['+', <added item>], [' ', <unchanged item>]] for two arrays when the second one has an extra value", function () {
      return assert.deepEqual(
        [
          [' ', 10],
          ['+', 20],
          [' ', 30],
        ],
        diff([10, 30], [10, 20, 30], {
          full: true,
        })
      );
    });
    return it("should return [' ', <unchanged item>s], ['+', <added item>]] for two arrays when the second one has an extra value at the end (edge case test)", function () {
      return assert.deepEqual(
        [
          [' ', 10],
          [' ', 20],
          ['+', 30],
        ],
        diff([10, 20], [10, 20, 30], {
          full: true,
        })
      );
    });
  });
  return describe('with arrays of objects', function () {
    it('should return an array of unchanged elements for two arrays with identical contents', function () {
      return assert.deepEqual(
        [
          {
            foo: 10,
          },
          {
            foo: 20,
          },
          {
            foo: 30,
          },
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          {
            full: true,
          }
        )
      );
    });
    it('should return an array with an unchanged element for two arrays with identical, empty object contents', function () {
      return assert.deepEqual(
        [{}],
        diff([{}], [{}], {
          full: true,
        })
      );
    });
    it('should return an array with an unchanged element for two arrays with identical, empty array contents', function () {
      return assert.deepEqual(
        [[]],
        diff([[]], [[]], {
          full: true,
        })
      );
    });
    it("should return an array of unchanged elements for two arrays with identical array contents including 'null'", function () {
      return assert.deepEqual(
        [1, null, null],
        diff([1, null, null], [1, null, null], {
          full: true,
        })
      );
    });
    it('should return an array of unchanged elements for two arrays with identical, repeated contents', function () {
      return assert.deepEqual(
        [
          {
            a: 1,
            b: 2,
          },
          {
            a: 1,
            b: 2,
          },
        ],
        diff(
          [
            {
              a: 1,
              b: 2,
            },
            {
              a: 1,
              b: 2,
            },
          ],
          [
            {
              a: 1,
              b: 2,
            },
            {
              a: 1,
              b: 2,
            },
          ],
          {
            full: true,
          }
        )
      );
    });
    it("should return [[' ', <unchanged item>], ['-', <removed item>], [' ', <unchanged item>]] for two arrays when the second array is missing a value", function () {
      return assert.deepEqual(
        [
          [
            ' ',
            {
              foo: 10,
            },
          ],
          [
            '-',
            {
              foo: 20,
            },
          ],
          [
            ' ',
            {
              foo: 30,
            },
          ],
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 30,
            },
          ],
          {
            full: true,
          }
        )
      );
    });
    it("should return [[' ', <unchanged item>], ['+', <added item>], [' ', <unchanged item>]] for two arrays when the second array has an extra value", function () {
      return assert.deepEqual(
        [
          [
            ' ',
            {
              foo: 10,
            },
          ],
          [
            '+',
            {
              foo: 20,
            },
          ],
          [
            ' ',
            {
              foo: 30,
            },
          ],
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          {
            full: true,
          }
        )
      );
    });
    it("should return [[' ', <unchanged item>], ['+', <added item>], [' ', <unchanged item>]] for two arrays when the second array has a new but nearly identical object added", function () {
      return assert.deepEqual(
        [
          [
            ' ',
            {
              name: 'Foo',
              a: 3,
              b: 1,
            },
          ],
          [
            '+',
            {
              name: 'Foo',
              a: 3,
              b: 1,
              c: 1,
            },
          ],
          [
            ' ',
            {
              foo: 10,
            },
          ],
        ],
        diff(
          [
            {
              name: 'Foo',
              a: 3,
              b: 1,
            },
            {
              foo: 10,
            },
          ],
          [
            {
              name: 'Foo',
              a: 3,
              b: 1,
            },
            {
              name: 'Foo',
              a: 3,
              b: 1,
              c: 1,
            },
            {
              foo: 10,
            },
          ],
          {
            full: true,
          }
        )
      );
    });
    return it("should return [[' ', <unchanged item>], ['~', <diff>], [' ', <unchanged item>]] for two arrays when an item has been modified", function () {
      return assert.deepEqual(
        [
          [
            ' ',
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
          ],
          [
            '~',
            {
              foo: {
                __old: 20,
                __new: 21,
              },
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
          ],
          [
            ' ',
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ],
        ],
        diff(
          [
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
            {
              foo: 20,
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ],
          [
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
            {
              foo: 21,
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ],
          {
            full: true,
          }
        )
      );
    });
  });
});

describe('diff({ outputKeys: foo,bar }', function () {
  it('should return keys foo and bar although they have no changes', function () {
    return assert.deepEqual(
      {
        foo: 42,
        bar: 10,
        bbar__added: 5,
      },
      diff(
        {
          foo: 42,
          bar: 10,
        },
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          outputKeys: ['foo', 'bar'],
        }
      )
    );
  });
  it('should return keys foo (with addition) and bar (with no changes) ', function () {
    return assert.deepEqual(
      {
        foo__added: 42,
        bar: 10,
        bbar__added: 5,
      },
      diff(
        {
          bar: 10,
        },
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          outputKeys: ['foo', 'bar'],
        }
      )
    );
  });
  it('should return keys foo and bar (with addition) ', function () {
    return assert.deepEqual(
      {
        foo__added: 42,
        bar__added: 10,
      },
      diff(
        {
          bbar: 5,
        },
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          outputKeys: ['foo', 'bar'],
        }
      )
    );
  });
  it('should return nothing as the entire object is equal, no matter that show keys has some of them', function () {
    return assert.deepEqual(
      void 0,
      diff(
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          outputKeys: ['foo', 'bar'],
        }
      )
    );
  });
  return it('should return the keys of an entire object although it has no changes ', function () {
    return assert.deepEqual(
      {
        foo: {
          a: 1,
          b: 2,
          c: [1, 2],
        },
        bbar__added: 5,
      },
      diff(
        {
          foo: {
            a: 1,
            b: 2,
            c: [1, 2],
          },
        },
        {
          foo: {
            a: 1,
            b: 2,
            c: [1, 2],
          },
          bbar: 5,
        },
        {
          outputKeys: ['foo', 'bar'],
        }
      )
    );
  });
});

describe('diff({ excludeKeys: foo,bar }', function () {
  it("shouldn't return keys foo and bar even thou they have changes", function () {
    return assert.deepEqual(
      {
        bbar__added: 5,
      },
      diff(
        {
          foo: 42,
        },
        {
          bar: 10,
          bbar: 5,
        },
        {
          excludeKeys: ['foo', 'bar'],
        }
      )
    );
  });
  it("shouldn't return keys foo (with addition) and bar (with no changes) ", function () {
    return assert.deepEqual(
      {
        bbar__added: 5,
      },
      diff(
        {
          bar: 10,
        },
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          excludeKeys: ['foo', 'bar'],
        }
      )
    );
  });
  return it("shouldn't return keys foo and bar (with addition) ", function () {
    return assert.deepEqual(
      void 0,
      diff(
        {
          bbar: 5,
        },
        {
          foo: 42,
          bar: 10,
          bbar: 5,
        },
        {
          excludeKeys: ['foo', 'bar'],
        }
      )
    );
  });
});

describe('diff({keysOnly: true})', function () {
  describe('with simple scalar values', function () {
    it('should return undefined for two identical numbers', function () {
      return assert.deepEqual(
        void 0,
        diff(42, 42, {
          keysOnly: true,
        })
      );
    });
    it('should return undefined for two identical strings', function () {
      return assert.deepEqual(
        void 0,
        diff('foo', 'foo', {
          keysOnly: true,
        })
      );
    });
    return it('should return undefined object for two different numbers', function () {
      return assert.deepEqual(
        void 0,
        diff(42, 10, {
          keysOnly: true,
        })
      );
    });
  });
  describe('with objects', function () {
    it('should return undefined for two empty objects', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {},
          {},
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return undefined for two objects with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {
            foo: 42,
            bar: 10,
          },
          {
            foo: 42,
            bar: 10,
          },
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return undefined for two object hierarchies with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return { <key>__deleted: <old value> } when the second object is missing a key', function () {
      return assert.deepEqual(
        {
          foo__deleted: 42,
        },
        diff(
          {
            foo: 42,
            bar: 10,
          },
          {
            bar: 10,
          },
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return { <key>__added: <new value> } when the first object is missing a key', function () {
      return assert.deepEqual(
        {
          foo__added: 42,
        },
        diff(
          {
            bar: 10,
          },
          {
            foo: 42,
            bar: 10,
          },
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return undefined for two objects with different scalar values for a key', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {
            foo: 42,
          },
          {
            foo: 10,
          },
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return undefined with a recursive diff for two objects with different values for a key', function () {
      return assert.deepEqual(
        void 0,
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 12,
            },
          },
          {
            keysOnly: true,
          }
        )
      );
    });
    return it('should return { <key>: <diff> } with a recursive diff when second object is missing a key and two objects with different values for a key', function () {
      return assert.deepEqual(
        {
          bar: {
            bbboz__deleted: 11,
          },
        },
        diff(
          {
            foo: 42,
            bar: {
              bbbar: 10,
              bbboz: 11,
            },
          },
          {
            foo: 42,
            bar: {
              bbbar: 12,
            },
          },
          {
            keysOnly: true,
          }
        )
      );
    });
  });
  describe('with arrays of scalars', function () {
    it('should return undefined for two arrays with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff([10, 20, 30], [10, 20, 30], {
          keysOnly: true,
        })
      );
    });
    it('should return undefined for two arrays with when an item has been modified', function () {
      return assert.deepEqual(
        void 0,
        diff([10, 20, 30], [10, 42, 30], {
          keysOnly: true,
        })
      );
    });
    it("should return [..., ['-', <removed item>], ...] for two arrays when the second array is missing a value", function () {
      return assert.deepEqual(
        [[' '], ['-', 20], [' ']],
        diff([10, 20, 30], [10, 30], {
          keysOnly: true,
        })
      );
    });
    it("should return [..., ['+', <added item>], ...] for two arrays when the second one has an extra value", function () {
      return assert.deepEqual(
        [[' '], ['+', 20], [' ']],
        diff([10, 30], [10, 20, 30], {
          keysOnly: true,
        })
      );
    });
    return it("should return [..., ['+', <added item>]] for two arrays when the second one has an extra value at the end (edge case test)", function () {
      return assert.deepEqual(
        [[' '], [' '], ['+', 30]],
        diff([10, 20], [10, 20, 30], {
          keysOnly: true,
        })
      );
    });
  });
  return describe('with arrays of objects', function () {
    it('should return undefined for two arrays with identical contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              foo: 20,
            },
            {
              foo: 30,
            },
          ],
          {
            keysOnly: true,
          }
        )
      );
    });
    it('should return undefined for two arrays with identical, empty object contents', function () {
      return assert.deepEqual(
        void 0,
        diff([{}], [{}], {
          keysOnly: true,
        })
      );
    });
    it('should return undefined for two arrays with identical, empty array contents', function () {
      return assert.deepEqual(
        void 0,
        diff([[]], [[]], {
          keysOnly: true,
        })
      );
    });
    it('should return undefined for two arrays with identical, repeated contents', function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            {
              a: 1,
              b: 2,
            },
            {
              a: 1,
              b: 2,
            },
          ],
          [
            {
              a: 1,
              b: 2,
            },
            {
              a: 1,
              b: 2,
            },
          ],
          {
            keysOnly: true,
          }
        )
      );
    });
    it("should return [..., ['-', <removed item>], ...] for two arrays when the second array is missing a value", function () {
      return assert.deepEqual(
        [
          [' '],
          [
            '-',
            {
              bar: 20,
            },
          ],
          [' '],
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              bar: 20,
            },
            {
              bletch: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              bletch: 30,
            },
          ],
          {
            keysOnly: true,
          }
        )
      );
    });
    it("should return [..., ['+', <added item>], ...] for two arrays when the second array has an extra value", function () {
      return assert.deepEqual(
        [
          [' '],
          [
            '+',
            {
              bar: 20,
            },
          ],
          [' '],
        ],
        diff(
          [
            {
              foo: 10,
            },
            {
              bletch: 30,
            },
          ],
          [
            {
              foo: 10,
            },
            {
              bar: 20,
            },
            {
              bletch: 30,
            },
          ],
          {
            keysOnly: true,
          }
        )
      );
    });
    return it("should return [..., ['~', <diff>], ...] for two arrays when an item has been modified", function () {
      return assert.deepEqual(
        void 0,
        diff(
          [
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
            {
              foo: 20,
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ],
          [
            {
              foo: 10,
              bar: {
                bbbar: 10,
                bbboz: 11,
              },
            },
            {
              foo: 21,
              bar: {
                bbbar: 50,
                bbboz: 25,
              },
            },
            {
              foo: 30,
              bar: {
                bbbar: 92,
                bbboz: 34,
              },
            },
          ],
          {
            keysOnly: true,
          }
        )
      );
    });
  });
});
