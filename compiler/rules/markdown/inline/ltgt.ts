import { replacePair } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule } from "../../../lib/types.ts";

const name = "ltgt";

const options = {};

const process = reapply(
  replacePair(
    name,
    /(?<pre>.*)(?<a>\\\<)(?<content>.*?)(?<b>\>)(?<post>.*)/,
    "&lt;",
    "&gt;",
    true
  )
);

const rule: InlineRule = {
  name,
  process,
  options,
};

export default rule;
