import { isPrimitive } from './type-check';

export interface ExpressionTokens {
  open: string;
  close: string;
}

export class ExpressionResolver {
  private expTokens: ExpressionTokens

  constructor(tokens?: ExpressionTokens) {
    this.expTokens = tokens || { open: '${', close: '}' }
  }

  public resolve(value: any, resolveValue: (any) => any) {
    let opnIdx: number;
    let clsIdx: number;

    let open: string = this.expTokens.open;
    let close: string = this.expTokens.close;

    let temp: string;

    while (typeof value === "string" && (opnIdx = value.lastIndexOf(open)) >= 0) {
      temp = value.slice(opnIdx + open.length);
      clsIdx = temp.indexOf(close);

      if (clsIdx === -1)
        throw new Error("An openning token was found at col " + opnIdx + " without its closing pair: ('" + value + "'). ");

      temp = temp.slice(0, clsIdx);
      temp = resolveValue(temp);

      if (!isPrimitive(temp)) {

        if (opnIdx !== 0 || clsIdx + open.length !== value.length -1)
          throw new Error("Expressions that resolves to non-primitive values can't be concatened. value: '" + value + "'");

        value = temp;

      } else {
        value = value.substr(0, opnIdx) + temp + value.substr(opnIdx + open.length + clsIdx + 1)
      }
    }

    return value;
  }
}
