export interface ExpressionTokens {
    open: string;
    close: string;
}
export declare class ExpressionResolver {
    private expTokens;
    constructor(tokens?: ExpressionTokens);
    resolve(value: any, resolveValue: (any) => any): any;
}
