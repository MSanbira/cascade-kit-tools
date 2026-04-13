// Layout utilities module
// Import the CSS file to include the layout utility classes
// Usage: import 'cascade-kit-tools/layoutUtils/styles';

// Re-export for convenience - users can import this to get type hints
// about available layout utility classes

/**
 * Available layout utility classes:
 * 
 * Display:
 * - d-flex: display: flex
 * - d-grid: display: grid
 * - col-container: display: grid with column template
 * 
 * Flex modifiers (use with d-flex):
 * - dir-col: flex-direction: column
 * - f-wrap: flex-wrap: wrap
 * - min-0: min-width: 0
 * 
 * Column container modifiers:
 * - col-num-2: 2 equal columns
 * - col-num-3: 3 equal columns
 * - col-num-4: 4 equal columns
 * - col-num-auto: auto-fill columns
 * - with-divider: adds dividers between columns
 * 
 * Alignment (use with d-flex, d-grid, col-container):
 * - ali-start: align-items: flex-start
 * - ali-center: align-items: center
 * - ali-end: align-items: flex-end
 * - ali-baseline: align-items: baseline
 * - ali-stretch: align-items: stretch
 * 
 * Justify (use with d-flex, d-grid, col-container):
 * - jc-start: justify-content: flex-start
 * - jc-center: justify-content: center
 * - jc-end: justify-content: flex-end
 * - jc-sb: justify-content: space-between
 * - jc-se: justify-content: space-evenly
 * 
 * Gap (use with d-flex, d-grid, col-container):
 * - gap-0_25, gap-0_5, gap-1, gap-1_5, gap-2, gap-2_5
 * - gap-3, gap-4, gap-5, gap-6, gap-7, gap-8, gap-10
 * - no-gap: gap: 0
 */

export const layoutUtilsClasses = {
  display: ['d-flex', 'd-grid', 'col-container'],
  flexModifiers: ['dir-col', 'f-wrap', 'min-0'],
  columnModifiers: ['col-num-2', 'col-num-3', 'col-num-4', 'col-num-auto', 'with-divider'],
  alignment: ['ali-start', 'ali-center', 'ali-end', 'ali-baseline', 'ali-stretch'],
  justify: ['jc-start', 'jc-center', 'jc-end', 'jc-sb', 'jc-se'],
  gap: ['gap-0_25', 'gap-0_5', 'gap-1', 'gap-1_5', 'gap-2', 'gap-2_5', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-7', 'gap-8', 'gap-10', 'no-gap'],
} as const;

export type LayoutUtilClass = 
  | typeof layoutUtilsClasses.display[number]
  | typeof layoutUtilsClasses.flexModifiers[number]
  | typeof layoutUtilsClasses.columnModifiers[number]
  | typeof layoutUtilsClasses.alignment[number]
  | typeof layoutUtilsClasses.justify[number]
  | typeof layoutUtilsClasses.gap[number];
