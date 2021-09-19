import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex = /(?<pre>.*)\_\{(?<content>.*)\}(?<post>.*)/;

const name = "sub";

const options = {};

const process = reapply(replaceTag(name, regex, "sub"));

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
