import type { CSSProperties } from 'react';

type SpacingValue = number | string;

export interface MixinBaseProps {
  m?: SpacingValue;
  mt?: SpacingValue;
  mr?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  p?: SpacingValue;
  pt?: SpacingValue;
  pr?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  display?: CSSProperties['display'];
  opacity?: number;
  position?: CSSProperties['position'];
  inset?: SpacingValue;
  top?: SpacingValue;
  right?: SpacingValue;
  bottom?: SpacingValue;
  left?: SpacingValue;
  flexDirection?: CSSProperties['flexDirection'];
  flexWrap?: CSSProperties['flexWrap'];
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  gap?: SpacingValue;
  gridColTemplate?: string;
  gridRowTemplate?: string;
  gridColumn?: string;
  gridRow?: string;
}

type ScreenBreakpoint = 'smallScreen' | 'mediumScreen' | 'bigScreen';
type ContainerBreakpoint = 'smallContainer' | 'mediumContainer' | 'bigContainer';
type BreakpointKey = ScreenBreakpoint | ContainerBreakpoint;

type ResponsiveMixin = { [K in ScreenBreakpoint]?: MixinBaseProps };
type ContainerMixin = { [K in ContainerBreakpoint]?: MixinBaseProps };

export type MixinProps = MixinBaseProps & ResponsiveMixin & ContainerMixin;

export interface MixinResult {
  className: string;
  style: CSSProperties;
}

const screenOrder: ScreenBreakpoint[] = ['smallScreen', 'mediumScreen', 'bigScreen'];
const containerOrder: ContainerBreakpoint[] = ['smallContainer', 'mediumContainer', 'bigContainer'];
const allBreakpoints: BreakpointKey[] = [...screenOrder, ...containerOrder];

const mixinBaseKeys: (keyof MixinBaseProps)[] = [
  'm', 'mt', 'mr', 'mb', 'ml', 'mx', 'my',
  'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py',
  'display', 'opacity', 'position',
  'inset', 'top', 'right', 'bottom', 'left',
  'flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'gap',
  'gridColTemplate', 'gridRowTemplate', 'gridColumn', 'gridRow'
];

function toSpacingValue(value: SpacingValue): string {
  return typeof value === 'string' ? value : `calc(var(--base-size) * ${value})`;
}

function toVarSuffix(bp: BreakpointKey): string {
  return bp.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function collectBoxShorthand(mixin: MixinBaseProps, prefix: 'm' | 'p'): string | undefined {
  const all = mixin[prefix];
  const t = mixin[`${prefix}t`] ?? mixin[`${prefix}y`] ?? all;
  const r = mixin[`${prefix}r`] ?? mixin[`${prefix}x`] ?? all;
  const b = mixin[`${prefix}b`] ?? mixin[`${prefix}y`] ?? all;
  const l = mixin[`${prefix}l`] ?? mixin[`${prefix}x`] ?? all;

  if (t === undefined && r === undefined && b === undefined && l === undefined) return undefined;
  return `${toSpacingValue(t ?? 0)} ${toSpacingValue(r ?? 0)} ${toSpacingValue(b ?? 0)} ${toSpacingValue(l ?? 0)}`;
}

function collectInsetShorthand(mixin: MixinBaseProps): string | undefined {
  const { inset, top, right, bottom, left } = mixin;
  const t = top ?? inset;
  const r = right ?? inset;
  const b = bottom ?? inset;
  const l = left ?? inset;

  if (t === undefined && r === undefined && b === undefined && l === undefined) return undefined;
  return `${toSpacingValue(t ?? 'auto')} ${toSpacingValue(r ?? 'auto')} ${toSpacingValue(b ?? 'auto')} ${toSpacingValue(l ?? 'auto')}`;
}

function processProps(props: MixinBaseProps, suffix = ''): { vars: Record<string, string>; classes: string[] } {
  const vars: Record<string, string> = {};
  const classes: string[] = [];
  const varSuffix = suffix ? `-${suffix}` : '';
  const classSuffix = suffix ? `-${suffix}` : '';

  const addProp = <T,>(
    value: T | undefined,
    cssName: string,
    transform: (v: T) => string = String as (v: T) => string
  ) => {
    if (value === undefined) return;
    vars[`--mixin-${cssName}${varSuffix}`] = transform(value);
    classes.push(`Mixin--${cssName}${classSuffix}`);
  };

  addProp(collectBoxShorthand(props, 'm'), 'margin');
  addProp(collectBoxShorthand(props, 'p'), 'padding');
  addProp(collectInsetShorthand(props), 'inset');

  addProp(props.display, 'display');
  addProp(props.opacity, 'opacity');
  addProp(props.position, 'position');
  addProp(props.flexDirection, 'flex-direction');
  addProp(props.flexWrap, 'flex-wrap');
  addProp(props.alignItems, 'align-items');
  addProp(props.justifyContent, 'justify-content');
  addProp(props.gap, 'gap', toSpacingValue);
  addProp(props.gridColTemplate, 'grid-col-template');
  addProp(props.gridRowTemplate, 'grid-row-template');
  addProp(props.gridColumn, 'grid-column');
  addProp(props.gridRow, 'grid-row');

  return { vars, classes };
}

function extractBaseProps(mixin: MixinProps): MixinBaseProps {
  const base: MixinBaseProps = {};
  for (const key of mixinBaseKeys) {
    if (mixin[key] !== undefined) {
      (base as Record<string, unknown>)[key] = mixin[key];
    }
  }
  return base;
}

function cascadeBreakpoints<T extends BreakpointKey>(mixin: MixinProps, order: T[]): MixinProps {
  const result = { ...mixin };
  
  for (const prop of mixinBaseKeys) {
    let lastValue: unknown;
    for (const bp of order) {
      const current = result[bp]?.[prop];
      if (current !== undefined) {
        lastValue = current;
      } else if (lastValue !== undefined) {
        result[bp] = { ...result[bp], [prop]: lastValue };
      }
    }
  }
  
  return result;
}

export function getMixin(mixin: MixinProps | undefined): MixinResult {
  if (!mixin) return { className: '', style: {} };

  let cascaded = cascadeBreakpoints(mixin, screenOrder);
  cascaded = cascadeBreakpoints(cascaded, containerOrder);

  const allVars: Record<string, string> = {};
  const allClasses: string[] = [];

  const baseProps = extractBaseProps(cascaded);
  const { vars: baseVars, classes: baseClasses } = processProps(baseProps);
  Object.assign(allVars, baseVars);
  allClasses.push(...baseClasses);

  for (const bp of allBreakpoints) {
    const bpProps = cascaded[bp];
    if (bpProps && Object.keys(bpProps).length > 0) {
      const { vars, classes } = processProps(bpProps, toVarSuffix(bp));
      Object.assign(allVars, vars);
      allClasses.push(...classes);
    }
  }

  return { className: allClasses.join(' '), style: allVars as CSSProperties };
}

export type { ScreenBreakpoint, ContainerBreakpoint, ResponsiveMixin, ContainerMixin };
