import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { createInlineRule } from "../../../lib/rules.ts";
import { InlineRuleOptions } from "../../../lib/types.ts";

const regex = /(?<pre>.*)(\*(?<content>.*)\*|_(?<content_alt>.*)_)(?<post>.*)/;

const name = "italic";

const options: InlineRuleOptions = {
  skipIfRulesMatched: ["link", "image"],
};

export default createInlineRule(
  name,
  reapply(replaceTag(name, regex, "i")),
  options
);
