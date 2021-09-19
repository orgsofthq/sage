import {
  InlineRule,
  InlineRuleOptions,
  MetaRule,
  ProcessInlineRule,
  ProcessMetaRule,
} from "./types.ts";

export const createInlineRule = (
  name: string,
  process: ProcessInlineRule,
  options?: InlineRuleOptions | null,
): InlineRule => {
  return { name, process, options: options ?? {} };
};

export const createMetaRule = (
  name: string,
  process: ProcessMetaRule,
): MetaRule => {
  return { name, process };
};
