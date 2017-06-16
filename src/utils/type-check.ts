const isArray = Array.isArray

export type primitive = number | string | null | undefined | boolean;
export type StrIndexed = {[key: string]: any};

export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function isObject(value: any): value is Object {
  return typeof value === "object" && value !== null && !isArray(value);
}

export function isPrimitive(value: any): value is number | string | boolean {
  return typeof value === "number" || typeof value === "string" || typeof value === "boolean";
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

export function isValid(value: any): boolean {
  return value !== null && value !== undefined;
}

export { isArray };
