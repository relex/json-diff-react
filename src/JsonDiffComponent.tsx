import { diffString, JsonDiffOptions, StyleCustomization } from './JsonDiff/Internal/index';
import 'react';

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
  unchangedClassName: "unchanged"
}

export function mkCustomization(customizations: Partial<StyleCustomization>): StyleCustomization {
  return { ...defaultStyleCustomization, ...customizations };
}

export function JsonDiffComponent
  ({ original, 
     latest, 
     styleCustomization, 
     jsonDiffOptions
  }: { 
     original: string, 
     latest: string, 
     styleCustomization?: Partial<StyleCustomization>,
     jsonDiffOptions?: JsonDiffOptions
  }): JSX.Element {

  let parsedOriginal = JSON.parse(original);
  let parsedLatest = JSON.parse(latest);

  let actualCustomization = styleCustomization ?? {};
  let fullCustomization = mkCustomization(actualCustomization);

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
}
