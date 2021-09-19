import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule, InlineRuleOptions } from "../../../lib/types.ts";

const regex = /(?<pre>.*)\`(?<content>.*)\`(?<post>.*)/;

const name = "code";

const options: InlineRuleOptions = {
  skipIfRulesMatched: ["blockcode-fence"],
};

const process = reapply(replaceTag(name, regex, "code"));

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
