import { LineToken, MetaRule } from "../../../lib/types.ts";
import { name as emptyLineName } from "../inline/empty_line.ts";

const string = "<br />";

const name = "newline";

const process = (lineTokens: LineToken[]): LineToken[] => {
  const outLineTokens: LineToken[] = [];

  let collapseToken: LineToken | null = null;

  for (let i = lineTokens.length - 1; i >= 0; i--) {
    const lt = lineTokens[i];

    // Ignore normal lines, only count purely empty lines
    if (lt.rules.length !== 1 || !lt.rules.includes(emptyLineName)) {
      if (collapseToken != null && !lt.block) {
        outLineTokens.push(collapseToken);
        collapseToken = null;
      }
      outLineTokens.push(lt);
      continue;
    }

    if (collapseToken != null) {
      continue;
    }

    collapseToken = lt;
  }
  return outLineTokens.reverse();
};

const rule: MetaRule = {
  name,
  process,
};

export default rule;
