import { match } from "../../../lib/match.ts";
import { createInlineRule } from "../../../lib/rules.ts";

const regex = /^\s*\`\`\`[\w\s]*$/;

const name = "blockcode-fence";

export default createInlineRule(name, match(name, regex), {
  block: true,
});
