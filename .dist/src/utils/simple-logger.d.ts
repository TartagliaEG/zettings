export declare function setLoggerLevel(lvl: number): void;
export declare const LVL_DEBUG = 0;
export declare const LVL_INFO = 1;
export declare const LVL_WARN = 2;
export declare const LVL_ERROR = 3;
export declare const LVL_NONE = 4;
export default class Logger {
    private readonly tag;
    constructor(tag: string);
    d(...values: any[]): void;
    i(...values: any[]): void;
    w(...values: any[]): void;
    e(...values: any[]): void;
}
