"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_check_1 = require("./type-check");
class ExpressionResolver {
    constructor(tokens) {
        this.expTokens = tokens || { open: '${', close: '}' };
    }
    resolve(value, resolveValue) {
        let opnIdx;
        let clsIdx;
        let open = this.expTokens.open;
        let close = this.expTokens.close;
        let temp;
        while (typeof value === "string" && (opnIdx = value.lastIndexOf(open)) >= 0) {
            temp = value.slice(opnIdx + open.length);
            clsIdx = temp.indexOf(close);
            if (clsIdx === -1)
                throw new Error("An openning token was found at col " + opnIdx + " without its closing pair: ('" + value + "'). ");
            temp = temp.slice(0, clsIdx);
            temp = resolveValue(temp);
            if (!type_check_1.isPrimitive(temp)) {
                if (opnIdx !== 0 || clsIdx + open.length !== value.length - 1)
                    throw new Error("Expressions that resolves to non-primitive values can't be concatened. value: '" + value + "'");
                value = temp;
            }
            else {
                value = value.substr(0, opnIdx) + temp + value.substr(opnIdx + open.length + clsIdx + 1);
            }
        }
        return value;
    }
}
exports.ExpressionResolver = ExpressionResolver;
//# sourceMappingURL=expression-resolver.js.map