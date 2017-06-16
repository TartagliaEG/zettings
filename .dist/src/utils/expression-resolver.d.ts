export interface ExpressionTokens {
    open: string;
    close: string;
}
export declare class ExpressionResolver {
    private expTokens;
    constructor(tokens?: ExpressionTokens);
    resolve(value: any, resolveValue: (value: any) => any): any;
}
