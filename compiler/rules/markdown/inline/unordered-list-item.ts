import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex =
  /^\s*(?<sym>\+|\-|\*)\s+(?<content>.*)$/;

const name = "unordered-list-item";

const options = {
};

const process = reapply(replaceTag(name, regex, 'li'))

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;