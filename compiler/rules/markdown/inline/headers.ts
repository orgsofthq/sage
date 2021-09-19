import { replaceTag } from "../../../lib/replace.ts";
import { clamp } from "../../../lib/clamp.ts";
import { InlineRule, InlineToken } from "../../../lib/types.ts";

const regex = /^(?<symbols>#+)\s*(?<content>.*)/;
const idRegex = /^#+\s*(\[(.*)\]|.*)/;

const name = "header";

const options = {
  block: true,
};

const slugify = (str: string) =>
  str.replaceAll(/\s/g, "-").replaceAll(/[^A-z0-9\-]/g, "").toLowerCase();

const process = (token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match != null) {
    const idMatch = idRegex.exec(token.text);
    const level = clamp(match.groups!.symbols.length, 1, 6);
    const anchor = idMatch?.[2] || idMatch?.[1];
    const slug = anchor != null ? slugify(anchor) : null;
    return replaceTag(
      name,
      regex,
      `h${level}`,
      slug != null ? { id: slug ?? "" } : undefined,
    )(token);
  }
  return null;
};

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
