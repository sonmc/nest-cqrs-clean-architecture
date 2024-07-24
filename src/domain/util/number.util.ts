export const parseFloatWithPrecision = (str: string): number => {
  str = str.toString();
  str = str.slice(0, str.indexOf('.') + 2 + 1);
  return Number(str);
};
