let level: number = 0;

export function setLoggerLevel(lvl: number) {
  level = lvl;
}

export const LVL_DEBUG = 0;
export const LVL_INFO = 1;
export const LVL_WARN = 2;
export const LVL_ERROR = 3;
export const LVL_NONE = 4;

export default class Logger {
  private readonly tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  public d(...values: any[]): void {
    if (level <= LVL_DEBUG)
      console.log.apply(console, ['D - ' + this.tag + ': '].concat(values));
  }

  public i(...values: any[]): void {
    if (level <= LVL_INFO)
      console.log.apply(console, ['I - ' + this.tag + ': '].concat(values));
  }

  public w(...values: any[]): void {
    if (level <= LVL_WARN)
      console.log.apply(console, ['W - ' + this.tag + ': '].concat(values));
  }

  public e(...values: any[]): void {
    if (level <= LVL_ERROR)
      console.log.apply(console, ['E - ' + this.tag + ': '].concat(values));
  }
}
