const isArray = Array.isArray

export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function isObject(value: any): value is Object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isPrimitive(value: any): value is number | string | boolean {
  return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
}

export function isValid(value: any): boolean {
  return value !== null && value !== undefined;
}

export { isArray };
