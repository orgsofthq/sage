import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex =
  /^\s*(?<sym>\d+\.)\s+(?<content>.*)$/;

const name = "ordered-list-item";

const options = {
  block: true,
};

const process = reapply(replaceTag(name, regex, 'li'))

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;