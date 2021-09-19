// Use to repeatedly apply a rule until it doesn't match anymore
import { InlineToken, ProcessInlineRule } from "./types.ts";

export const reapply = (processFn: ProcessInlineRule) =>
  (token: InlineToken) => reapplyUncurry(token, processFn, 0);

const DEPTH_LIMIT = 10;

const reapplyUncurry = (
  token: InlineToken,
  processFn: ProcessInlineRule,
  depth: number,
): InlineToken[] | null => {
  if (depth >= DEPTH_LIMIT) return null;

  let curTokens: InlineToken[] | null;
  let parentTokens: InlineToken[] = [];

  let matched = false;

  if ((curTokens = processFn(token)) != null) {
    matched = true;

    for (let i = 0; i < curTokens!.length; i++) {
      const childToken = curTokens![i];
      const newChildTokens = reapplyUncurry(childToken, processFn, depth + 1);
      if (newChildTokens != null) {
        const index = curTokens!.indexOf(childToken);
        curTokens!.splice(index, 1, ...newChildTokens!);
      }
    }

    parentTokens = parentTokens.concat(curTokens!);
  }

  return matched ? parentTokens : null;
};
