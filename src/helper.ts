export const getPascalCaseString = (inputStr: string): string => {
  return inputStr.substring(0, 1).toUpperCase() + inputStr.slice(1);
};

export const convertToCamelcase = (str: string): string =>
  str.charAt(0).toLowerCase() + str.substring(1);

export const checkArray = (inputObject: object[] | undefined) =>
  Array.isArray(inputObject);
