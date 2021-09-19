import { InlineToken } from "./types.ts";

export const toks = (maybeTokens: (InlineToken | null)[]): InlineToken[] =>
  // @ts-ignore Should be fine
  maybeTokens.filter(Boolean);

export const tok = (
  baseToken: InlineToken,
  text?: string,
  rule?: string,
): InlineToken | null => {
  if (text == null) {
    return null;
  }
  return {
    text,
    rules: rule != null ? baseToken.rules.concat(rule) : baseToken.rules,
  };
};

export const tokx = (
  baseToken: InlineToken,
  text: string,
  rule?: string,
): InlineToken => {
  return {
    text,
    rules: rule != null ? baseToken.rules.concat(rule) : baseToken.rules,
  };
};
