import { replaceCompose, replaceString } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule, InlineRuleOptions } from "../../../lib/types.ts";

const name = "newline";

const options: InlineRuleOptions = {};

const process = reapply(
  replaceCompose([
    replaceString(name, /^(?<pre>.*)(?<text>\s\s)(?<post>.*)$/, "<br />"),
  ]),
);

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
