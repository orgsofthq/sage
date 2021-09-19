import { RuleSet } from "../../lib/types.ts";
import getMdRuleset from "../markdown/ruleset.ts";

export default async () => {
  const md = await getMdRuleset();

  const extendedRules = [
    await import("./inline/backlink.ts"),
    await import("./inline/sup.ts"),
    await import("./inline/sub.ts"),
    await import("./inline/symbols.ts"),
    await import("./inline/emoji.ts"),
    await import("./inline/mark.ts"),
  ].map((x) => x.default);

  const ruleset: RuleSet = {
    inlineRules: [...md.inlineRules!, ...extendedRules],
    metaRules: [...md.metaRules!],
  };
  return ruleset;
};
