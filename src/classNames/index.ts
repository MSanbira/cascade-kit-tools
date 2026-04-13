export const classNames = (rootName?: string, classNames: string | string[] = [], conditionals: Record<string, boolean> = {}) => {
  const classes = rootName ? [rootName] : [];

  if (typeof classNames === 'string') {
    classes.push(classNames);
  } else {
    classes.push(...classNames);
  }

  Object.entries(conditionals).forEach(([key, value]) => {
    if (value) {
      classes.push(key);
    }
  });

  return classes.join(' ');
};
