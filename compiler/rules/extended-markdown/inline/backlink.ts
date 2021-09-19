import { InlineRule, InlineToken } from "../../../lib/types.ts";
import { reapply } from "../../../lib/reapply.ts";
import { tok, toks } from "../../../lib/token.ts";

const regex =
  /(?<pre>.*)\[\[(?<text>[\w\s&\/\-\_\.]+)(\|(?<url>[\w\s&\/\-\_\.]+))?\]\](?<post>.*)/;

const name = "backlink";

const options = {};

const processPageName = (pageName: string): string =>
  pageName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/%\w{2}|\&/g, "");

const process = reapply((token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match == null) {
    return null; 
  }
  const url = match.groups!.url ?? `./${processPageName(match.groups!.text)}`;
  return toks([
    tok(token, match.groups!.pre),
    tok(token, `<a href="${url}">${match.groups!.text}</a>`, name),
    tok(token, match.groups!.post),
  ]);
});

const rule: InlineRule = {
  name,
  process,
  options
};

export default rule;
