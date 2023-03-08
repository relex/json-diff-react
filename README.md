# json-diff-react

![Example of the React component](example.png)

A react component that renders a structural diff of two JSON values. Written
in TypeScript except for the JavaScript code inherited from `json-diff`.
Types are declared for all user facing functionality.

This is a fork of https://github.com/andreyvit/json-diff with all of the
dependencies towards `node.js` core modules removed. Code from `json-diff` can
be found under `src/JsonDiff/Internal` and it's mostly unchanged - expect for
the `colorize` module which now returns a JSX element instead of a string.

Look into the `example` directory to find an example application that uses this
component.

## Customization

The `<JsonDiffComponent />` requires 4 input properties:

1. `jsonA`: a JSON value
   - The caller is responsible for providing a valid, parsed JSON value (e.g. via `JSON.parse`)
2. `jsonB`: a JSON value that is compared to `jsonA`
   - The caller is responsible for providing a valid, parsed JSON value
3. `styleCustomization`: CSS customization of the markup
4. `jsonDiffOptions`: options that are fed directly to original `json-diff` code

### Style customization

There are two ways to customize the look of the component:

1. via a `CSS` file
2. via `styleCustomization` property of `<JsonDiffComponent />`

#### CSS

Import a CSS file that defines the following classes to your `.tsx` file:

``` css
.deletion {
  /* customization for deleted lines (div) */
}

.addition {
  /* customization for added lines (div) */
}

.unchanged {
  /* customization for unchanged lines (div) */
}

.diff {
  /* customization for the top-level <div> wrapper that contains the diff */
}
```

The names of the classes can be customized via `styleCustomization`.

#### styleCustomization

You can also use the `styleCustomization` property to customize how the
component looks and rename the CSS classes.

``` typescript
export type StyleCustomization = {
  additionLineStyle: CSS.Properties | null;
  additionClassName: string | null | undefined;
  deletionLineStyle: CSS.Properties | null;
  deletionClassName: string | null | undefined;
  unchangedLineStyle: CSS.Properties | null;
  unchangedClassName: string | null | undefined;
  frameStyle: CSS.Properties | null;
  frameClassName: string | null | undefined;
};
```

Explanation of each customization option:

* `additionLineStyle`: `style` attribute of the HTML `<div>` element that is
  used to render added lines in the diff
  * Defaults to `null` if not specified
* `additionClassName`: `className` attribute of the HTML `<div>` element that
  is used to render added lines in the diff
  * Defaults to `addition` if not specified
* `deletionLineStyle`: `style` attribute of the HTML `<div>` element that is
  used to render deleted lines in the diff
  * Defaults to `null` if not specified
* `deletionClassName`: `className` attribute of the HTML `<div>` element that
  is used to render deleted lines in the diff
  * Defaults to `deletion` if not specified
* `unchangedLineStyle`: `style` attribute of the HTML `<div>` element that is
  used to render unchanged lines in the diff
  * Defaults to `null` if not specified
* `unchangedClassName`: `className` attribute of the HTML `<div>` element that
  is used to render unchanged lines in the diff
  * Defaults to `unchanged` if not specified
* `frameStyle`: `style` attribute of the HTML `<div>` element that contains the
  whole rendered diff, i.e. the top level `div`
  * Can be used to customize background, etc.
  * Defaults to `null` if not specified
* `frameClassName`: `className` attribute of the HTML `<div>` element that
  contains the whole rendered diff, i.e. the top level `div`
  * Defaults to `diff`


### Options fed to json-diff

You can pass options to the underlying `json-diff` functions via
`jsonDiffOptions` which has the following type:

``` typescript
export interface DiffOptions {
    verbose?: boolean;
    raw?: boolean;
    keysOnly?: boolean;
    full?: boolean;
    sort?: boolean;
    outputKeys?: string[];
    keepUnchangedValues?: boolean;
    outputNewOnly?: boolean;
    maxElisions?: number;
    precision?: number;
}
```

All of the fields are optional. Consult the original `json-diff` library to
learn more about how the options affect the output.

This type came from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-diff/index.d.ts.

N.B. I added the `excludeKeys` attribute to the `DiffOptions` imported from
`DefinitelyTyped`. It appears like the type definitions in `DefinitelyTyped`
are outdated.
