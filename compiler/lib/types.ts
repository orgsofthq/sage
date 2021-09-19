import { CompilerFileSource } from "../compiler.ts";

export type InlineToken = {
  text: string;
  rules: string[];
};

export type LineToken = {
  subtokens: InlineToken[];
  block: boolean;
  rules: string[];
};

export type ProcessInlineRule = (token: InlineToken) => InlineToken[] | null;

export type ProcessMetaRule = (input: LineToken[]) => LineToken[];

// export type ProcessLinesRule = (input: LineToken[]) => string[];

// export type ProcessFileRule = (input: string[]) => string;

export type ProcessFileRule = (input: string) => string;

export type ProcessDirectoryRule = (source: CompilerFileSource) => Promise<boolean>;

export type InlineRule = {
  name: string;
  process: ProcessInlineRule;
  options?: InlineRuleOptions;
};

export type InlineRuleOptions = {
  skipIfRulesMatched?: string[];
  includeBefore?: string[];
  includeAfter?: string[];
  block?: boolean;
};

export type MetaRule = {
  name: string;
  process: ProcessMetaRule;
};

// export type PrintLineRule = {
//   name: string;
//   process: ProcessLinesRule;
// }

// export type PrintFileRule = {
//   name: string;
//   process: ProcessFileRule;
// }
//

export type FileRule = {
  name: string;
  process: ProcessFileRule;
};

export type DirectoryRule = {
  name: string;
  process: ProcessDirectoryRule;
};

export type RuleSet = {
  inlineRules?: InlineRule[];
  metaRules?: MetaRule[];
  preFileRules?: FileRule[];
  postFileRules?: FileRule[];
  directoryRules?: DirectoryRule[];
};
