import { FileRule, RuleSet } from "../../lib/types.ts";

const minHtmlPreamble = `<!doctype html><meta charset="UTF-8">`;
const liveReloadPreamble = `<script type="text/javascript" src="https://livejs.com/live.js"></script>`;

export const defaultPreamble = `${minHtmlPreamble}${liveReloadPreamble}`;

const name = "html";

export type HtmlRulesetOptions = {
  // Include bare minimum html markup that declares the document html & UTF-8
  minHtmlPreamble?: boolean;
  // Custom string to be attached at the beginning of output file
  preamble?: string;
  // Custom  string to be included at the end of the output file
  postamble?: string;
  // Include live.js
  liveReload?: boolean;
};

export const defaultHtmlOpts: HtmlRulesetOptions = {
  minHtmlPreamble: true,
  liveReload: true,
};

export const getCustomHtmlRule = (opts?: HtmlRulesetOptions): FileRule => {
  const fullOpts = { ...defaultHtmlOpts, ...(opts || {}) };
  return {
    name,
    process: (input: string): string => {
      return `${fullOpts.minHtmlPreamble === false ? "" : minHtmlPreamble}${
        fullOpts.liveReload === false ? "" : liveReloadPreamble
      }${fullOpts.preamble ?? ""}${input}${fullOpts.postamble ?? ""}`;
    },
  };
};

export const getCustomHtmlRuleset = (opts?: HtmlRulesetOptions): RuleSet => ({
  postFileRules: [getCustomHtmlRule(opts)],
});

export default (opts?: HtmlRulesetOptions) => getCustomHtmlRuleset(opts);
