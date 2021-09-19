import { InlineToken, ProcessInlineRule } from "./types.ts";
import { tokx } from "./token.ts";

export const match =
  (rulename: string, regex: RegExp): ProcessInlineRule =>
  (token: InlineToken): InlineToken[] | null => {
    const match = regex.exec(token.text);
    if (match == null) {
      return null;
    }
    return [tokx(token, token.text, rulename)];
  };

export const matchCompose =
  (processFns: ProcessInlineRule[]): ProcessInlineRule =>
  (token: InlineToken): InlineToken[] | null => {
    for (const fn of processFns) {
      const result = fn(token);
      if (result != null) {
        return result;
      }
    }
    return null;
  };
