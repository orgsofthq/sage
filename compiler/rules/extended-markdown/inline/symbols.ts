import { replaceCompose, replaceString } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const name = "symbols";

const options = {};

const process = reapply(
  replaceCompose([
    replaceString(name, /(?<pre>.*)(?<text>\.\.+)(?<post>.*)/, "…"),
    replaceString(name, /(?<pre>.*)(?<text>\([cC]\))(?<post>.*)/, "©"),
    replaceString(name, /(?<pre>.*)(?<text>\([rR]\))(?<post>.*)/, "®"),
    replaceString(name, /(?<pre>.*)(?<text>\((tm|TM)\))(?<post>.*)/, "™"),
    replaceString(name, /(?<pre>.*)(?<text>\+\-)(?<post>.*)/, "±"),
  ])
);

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
