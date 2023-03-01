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

1. `original`: original string of JSON text
   - If the text can't be parsed as JSON, an error is rendered.
2. `latest`: new string of JSON text that is compared to `original`
   - If the text can't be parsed as JSON, an error is rendered.
3. `onError`: callback function that is called if an error occurs
   - Mostly used to handle situations where `original` or `latest` cannot be
     parsed as JSON
   - Use this to render the error in any way you want.
3. `styleCustomization`: CSS customization of the markup
4. `jsonDiffOptions`: options that are fed directly to `json-diff`

### Style customization

There are two ways to customize the look of the component:

1. via a `CSS` file
2. via `styleCustomization` property of `<JsonDiffComponent />`

#### CSS

Import a CSS file that defines the following classes to your `.tsx` file:

``` scss 
.deletion {
  /* customization for deleted lines (span) */
}

.addition {
  /* customization for added lines (span) */
}

.unchanged {
  /* customization for unchanged lines (span) */
}

.diff {
  /* customization for the <div> that contains the diff
}
```

The names of the classes can be customized via `styleCustomization`.

#### styleCustomization

You can also use the `styleCustomization` property to customize how the
component looks and rename the CSS classes.

``` typescript 
export type StyleCustomization = {
  additionLineStyle: CSS.Properties,
  additionClassName: string,
  deletionLineStyle: CSS.Properties,
  deletionClassName: string,
  unchangedLineStyle: CSS.Properties,
  unchangedClassName: string,
  frameStyle: CSS.Properties,
  frameClassName: string
}
```

Explanation of each customization option:

* `additionLineStyle`: `style` attribute of the HTML `<span>` element that is
  used to render additions in the diff
  * Defaults to `{ color: "green", "lineHeight": 0.5 }` if not specified
* `additionClassName`: `className` attribute of the HTML `<span>` element that
  is used to render additions in the diff
  * Defaults to `addition` if not specified
* `deletionLineStyle`: `style` attribute of the HTML `<span>` element that is
  used to render deletions in the diff
  * Defaults to `{ color: "red", "lineHeight": 0.5 }` if not specified
* `deletionClassName`: `className` attribute of the HTML `<span>` element that
  is used to render deletions in the diff
  * Defaults to `deletion` if not specified
* `unchangedLineStyle`: `style` attribute of the HTML `<span>` element that is
  used to render unchanged lines in the diff
  * Defaults to `{ "lineHeight": 0.5 }` if not specified
* `unchangedClassName`: `className` attribute of the HTML `<span>` element that
  is used to render unchanged lines in the diff
  * Defaults to `unchanged` if not specified
* `frameStyle`: `style` attribute of the HTML `<div>` element that contains the
  rendered diff
  * Can be used to customize background, etc.
  * Defaults to no customizations if not specified.
* `frameClassName`: `className` attribute of the HTML `<div>` element that
  contains the rendered diff 
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
