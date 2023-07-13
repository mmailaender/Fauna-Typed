export const getPascalCaseString = (inputStr: string): string => {
  return inputStr.substring(0, 1).toUpperCase() + inputStr.slice(1);
};

export const convertToCapitalCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.substring(1);

export const convertToCamelcase = (str: string): string =>
  str.charAt(0).toLowerCase() + str.substring(1);

export const checkArray = (inputObject: object[] | undefined) =>
  Array.isArray(inputObject);

const types = {
  int: 'number',
  float: 'number',
  string: 'string',
};

export const getKeyType = (value: any, fieldKey: string) => {
  // return type for embedded onject
  if (typeof value === 'object') {
    return getPascalCaseString(fieldKey);
  }

  return (value || '')
    .split('|')
    .map((s: string) => types[s.trim() as keyof typeof types] || s)
    .join(' | ');
};
