import { tokx } from "../../../lib/token.ts";
import { InlineRule, InlineToken } from "../../../lib/types.ts";

const regex = /^$/;

export const name = "empty_line";

const options = {
  block: true
};

const process = (token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match != null) {
    return [tokx(token, "", name)];
  }
  return null;
};

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
