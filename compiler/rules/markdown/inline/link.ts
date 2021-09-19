import { reapply } from "../../../lib/reapply.ts";
import { tok, toks } from "../../../lib/token.ts";
import { InlineRule, InlineToken } from "../../../lib/types.ts";

const regex =
  /(?<pre>.*)\[(?<text>.*)\]\((?<url>.+?)(\s+\"(?<title>.*)\")?\)(?<post>.*)/;

const name = "link";

const options = {};

const process = reapply((token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match == null) {
    return null;
  }
  return toks([
    tok(token, match.groups!.pre),
    tok(
      token,
      `<a href="${match.groups!.url}"${
        match.groups!.title ? ` alt="${match.groups!.title}"` : ""
      }>${match.groups!.text}</a>`,
      name
    ),
    tok(token, match.groups!.post),
  ]);
});

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
