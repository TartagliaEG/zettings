declare const isArray: (arg: any) => arg is any[];
export declare type primitive = number | string | null | undefined | boolean;
export declare function isNumeric(value: any): boolean;
export declare function isObject(value: any): value is Object;
export declare function isPrimitive(value: any): value is number | string | boolean;
export declare function isString(value: any): value is string;
export declare function isBoolean(value: any): value is boolean;
export declare function isValid(value: any): boolean;
export { isArray };
