import { InlineRule, InlineToken, LineToken } from "../lib/types.ts";

const empty: string[] = [];

export default function (
  input: string,
  inlineRules: InlineRule[],
): LineToken[] {
  const lineTokens: LineToken[] = [];

  for (const line of input.split("\n")) {
    const inlineTokens: InlineToken[] = [
      {
        text: line,
        rules: [],
      },
    ];
    const rulesApplied: Set<string> = new Set();

    let block = false;
    for (const rule of inlineRules) {
      for (const token of inlineTokens) {
        if (
          (rule.options?.skipIfRulesMatched || empty).find((innerRule) => {
            // Check if rule has already been applied to token
            return token.rules.includes(innerRule)
          })
        ) {
          continue;
        }
        const tokens = rule.process(token);
        if (tokens != null) {
          if (rule.options?.block) {
            block = true;
          }
          rulesApplied.add(rule.name);
          const index = inlineTokens.indexOf(token);
          inlineTokens.splice(index, 1, ...tokens!);
        } else {
          // skip
        }
      }
    }

    lineTokens.push({
      subtokens: inlineTokens,
      block: block,
      rules: rulesApplied.size > 0 ? [...rulesApplied] : ["plain"],
    });
  }

  return lineTokens;
}
