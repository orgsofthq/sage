import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";
import { replaceTag } from "../../../lib/replace.ts";

const regex = /(?<pre>.*)\+\+(?<content>.*)\+\+(?<post>.*)/;

const name = "ins";

const options = {};

const process = reapply(replaceTag(name, regex, "ins"));

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
