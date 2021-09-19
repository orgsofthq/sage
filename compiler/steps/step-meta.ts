import { LineToken, MetaRule } from "../lib/types.ts";

export default function (
  input: LineToken[],
  metaRules: MetaRule[],
): LineToken[] {
  let lineTokens = input;
  for (const rule of metaRules) {
    lineTokens = rule.process(lineTokens);
  }
  return lineTokens;
}
