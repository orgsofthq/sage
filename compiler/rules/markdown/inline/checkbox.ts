import { createInlineRule } from "../../../lib/rules.ts";
import { tokx } from "../../../lib/token.ts";
import { InlineToken } from "../../../lib/types.ts";

const regex = /^\s*(\+|\-|\*|\d+\.)\s+\[(?<sym>[ _x])\](?<content>.*)$/;

const name = "checkbox";

const process = (token: InlineToken): InlineToken[] | null => {
  const match = regex.exec(token.text);
  if (match == null) {
    return null;
  }
  return [
    tokx(
      token,
      `${match.groups!.sym === "x" ? "☑" : "☐"}${match.groups!.content}<br />`,
      name,
    ),
  ];
};

export default createInlineRule(name, process, { block: true });
