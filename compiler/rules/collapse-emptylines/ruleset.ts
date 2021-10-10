import { RuleSet, LineToken, MetaRule } from "../../lib/types.ts";


const regex = /^\s*$/;
const name = "collapse-emptylines";

const process = (lineTokens: LineToken[]): LineToken[] => {
  const outLineTokens: LineToken[] = [];

  for (let i = lineTokens.length - 1; i >= 0; i--) {
    const lt = lineTokens[i];
    if (lt.rules.length > 1 || lt.subtokens.length > 1) {
        outLineTokens.push(lt);
        continue;
    }

    if (lt.subtokens.length === 0) {
        continue;
    }

    const match = regex.exec(lt.subtokens[0].text);
    if (match == null) {
        outLineTokens.push(lt);
        continue;
    }

    continue; // without pushing
  }
  return outLineTokens.reverse();
};

const rule: MetaRule = {
  name,
  process,
};

export const getRuleset = (): RuleSet => ({
  metaRules: [rule]
});

export default getRuleset
