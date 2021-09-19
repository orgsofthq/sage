import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex = /(?<pre>.*)\^\{(?<content>.*)\}(?<post>.*)/;

const name = "sup";

const options = {};

const process = reapply(replaceTag(name, regex, "sup"));

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
