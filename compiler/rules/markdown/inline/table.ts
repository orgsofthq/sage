import { match, matchCompose } from "../../../lib/match.ts";
import { InlineRule } from "../../../lib/types.ts";

export const regex = /^\s*(?:\|\s*([^|]+)).*?/;
export const rowRegex = /(?:\|\s*([^|]+)).*?/;

export const name = "table";

const options = {
  block: true,
};

const process = matchCompose([match(name, regex)]);

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
