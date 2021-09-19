import { replaceTag } from "../../../lib/replace.ts";
import { reapply } from "../../../lib/reapply.ts";
import { createInlineRule } from "../../../lib/rules.ts";

const regex = /^>\s*(?<content>.*)/;

const name = "blockquote";

export default createInlineRule(
  name,
  reapply(replaceTag(name, regex, name)),
);
