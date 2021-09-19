import { replaceCompose, replaceString } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const name = "emoji";

const options = {};

const process = reapply(
  replaceCompose([
    replaceString(name, /(?<pre>.*)(?<text>\:\-?\)+)(?<post>.*)/, "😃"),
    replaceString(name, /(?<pre>.*)(?<text>\:\-?\(+)(?<post>.*)/, "😦"),
    replaceString(name, /(?<pre>.*)(?<text>8\-?\)+)(?<post>.*)/, "😎"),
    replaceString(name, /(?<pre>.*)(?<text>\;\-?\)+)(?<post>.*)/, "😉"),
  ]),
);

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
