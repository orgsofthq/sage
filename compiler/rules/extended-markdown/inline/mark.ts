import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const regex = /(?<pre>.*)\^\^(?<content>.*)\^\^(?<post>.*)/;

const name = "mark";

const options = {};

const process = reapply(replaceTag(name, regex, "mark"));

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
