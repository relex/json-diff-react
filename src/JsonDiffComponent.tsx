import { diffString, JsonDiffOptions, StyleCustomization } from './JsonDiff/Internal/index';
import React from 'react';

const defaultStyleCustomization: StyleCustomization = {
  additionLineStyle: { 
    color: "green",
    lineHeight: 0.5
  },
  additionClassName: "addition",
  deletionLineStyle: { 
    color: "red" ,
    lineHeight: 0.5
  },
  deletionClassName: "deletion",
  unchangedLineStyle: {
    lineHeight: 0.5
  },
  unchangedClassName: "unchanged",
  frameStyle: {},
  frameClassName: "diff"
}

export function mkCustomization(customizations: Partial<StyleCustomization>): StyleCustomization {
  return { ...defaultStyleCustomization, ...customizations };
}

export function JsonDiffComponent
  ({ original, 
     latest, 
     onError,
     styleCustomization = {}, 
     jsonDiffOptions = {}
  }: { 
     original: string, 
     latest: string, 
     onError: (e: Error) => JSX.Element,
     styleCustomization?: Partial<StyleCustomization>,
     jsonDiffOptions?: JsonDiffOptions
  }): JSX.Element {

  let actualCustomization = styleCustomization ?? {};
  let fullCustomization = mkCustomization(actualCustomization);

  try {
    let parsedOriginal = JSON.parse(original);
    let parsedLatest = JSON.parse(latest);

    let diffElement = diffString(
      parsedOriginal, 
      parsedLatest, 
      jsonDiffOptions,
      fullCustomization
    );

    return (
      <div>
        {diffElement}
      </div>
    );
  } catch(e: any) {
    return onError(new Error(e.toString())); 
  }
}
