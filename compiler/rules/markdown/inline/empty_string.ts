import { InlineRule, InlineToken } from "../../../lib/types.ts";

const regex = /^$/;

export const name = "empty_string";

const options = {
  block: false,
};

const process = (token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match != null && token.rules.length === 0) {
    return [];
  }
  return null;
};

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
