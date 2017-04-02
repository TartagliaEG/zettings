
export function isNumeric(value: any): boolean {
  return !isNaN(value) && isFinite(value);
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null;
}