import { replaceString } from "../../../lib/replace.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex = /^(?<sym>---+|___+|\*\*\*+)\s*$/;

const name = "hr";

const options = {
  block: true,
};

const process = replaceString(name, regex, "<hr />");

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
