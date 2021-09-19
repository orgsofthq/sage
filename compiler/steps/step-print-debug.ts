import { LineToken } from "../lib/types.ts";
import { defaultPreamble } from "../rules/html/ruleset.ts";

export const printInlineTokenDebug = (input: LineToken[]): string => {
  // const printSubtokens = (i: InlineToken[]): string => {
  //   return i
  //     .map((x) => JSON.stringify(x))
  //     .join(" | ")
  //     .replaceAll("<", "&lt;")
  //     .replaceAll(">", "&gt;");
  // };
  const printLineToken = (lt: LineToken): string => {
    return JSON.stringify(lt, null).replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  };
  return `${defaultPreamble}<pre><code>${
    input
      .map((line) => printLineToken(line))
      .join("<br />\n")
  }</code></pre>`;
};
