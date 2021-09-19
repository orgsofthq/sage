import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex = /(?<pre>.*)~~(?<content>.*)~~(?<post>.*)/;

const name = "strikethrough";

const options = {
  skipIfRulesMatched: ["link"],
};

const process = reapply(replaceTag(name, regex, "s"));

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
