import type { CSSProperties } from 'react';

type CSSVars = { [key: `--${string}`]: string | number };
type BaseStyles = CSSProperties & CSSVars;
export type ScopedStylesObj = BaseStyles & { [selector: string]: string | number | ScopedStylesObj };

export type LayerOptions = 'base' | 'utils' | 'components' | 'pages' | 'component-overrides' | 'user-overrides';

const toKebabCase = (str: string) => str.startsWith('--') ? str : str.replace(/([A-Z])/g, '-$1').toLowerCase();

const isSelector = (_key: string, value: unknown): value is BaseStyles =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const parseStyles = (style: ScopedStylesObj): string => {
  let styleString: string = '';

  for (const [key, value] of Object.entries(style)) {
    if (isSelector(key, value)) {
      const parsed = parseStyles(value as ScopedStylesObj);
      styleString += `${key} { ${parsed} }`;
    } else {
      styleString += `${toKebabCase(key)}: ${value};`;
    }
  }

  return styleString;
};

interface ScopedStyleProps {
  style?: ScopedStylesObj;
  layer?: LayerOptions;
}

export function ScopedStyle({ 
  style = {}, 
  layer = 'component-overrides' 
}: ScopedStyleProps) {
  const stylesString = parseStyles(style);
  if (!stylesString) return null;
  
  return (
    <style>
      {`@layer ${layer}{ @scope { :scope { ${stylesString} } } }`}
    </style>
  );
}
