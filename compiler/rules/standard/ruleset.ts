// Default flavor of rules
// Includes: html output, live reloading, markdown parsing, nunjucks
// Can also be customized

import { RuleSet } from "../../lib/types.ts";
import getEmdRuleset from "../extended-markdown/ruleset.ts";
import getNunjucksRuleset, { NunjucksRuleOpts } from "../nunjucks/ruleset.ts";

import html, {
  getCustomHtmlRule,
  HtmlRulesetOptions,
} from "../html/ruleset.ts";
import resRule from "./directory/res.ts";
import { CompilerOptions, FileCompilerOptions } from "../../compiler.ts";

type StandardRulesetOptions = {
  html: HtmlRulesetOptions;
  nunjucks: NunjucksRuleOpts;
};

export const getRuleset = async (
  opts?: StandardRulesetOptions,
  compilerOpts?: FileCompilerOptions,
) => {
  const emd = await getEmdRuleset();
  const nunjucks = await getNunjucksRuleset(
    opts?.nunjucks, compilerOpts,
  );

  return {
    inlineRules: emd.inlineRules,
    metaRules: emd.metaRules,
    preFileRules: [
      ...(nunjucks.preFileRules ?? []),
    ],
    postFileRules: [
      getCustomHtmlRule(opts?.html || {}),
    ],
    directoryRules: [
      resRule,
    ],
  };
};

export default getRuleset;
