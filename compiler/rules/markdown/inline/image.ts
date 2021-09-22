import { toks, tok } from "../../../lib/token.ts";
import { reapply } from "../../../lib/reapply.ts";
import { InlineRule, InlineToken } from "../../../lib/types.ts";

const regex =
  /(?<pre>.*)\!\[(?<title>.*)\]\((?<url>.*?)(\s\"(?<alt>.*)\")?\)(?<post>.*)/;

const name = "image";

const options = {
  block: true,
};

const process = reapply((token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match == null) {
    return null;
  }
  return toks([
    tok(token, match.groups!.pre),
    tok(
      token,
      `<img src="${match.groups!.url}" title="${match.groups!.title}" ${
        match.groups!.alt ? `alt="${match.groups!.alt}"` : ""
      }/>`,
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
