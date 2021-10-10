import nunjucks from "../../../deps/nunjucks.ts";
import { FileCompilerOptions } from "../../compiler.ts";
import { ProcessFileRule, RuleSet } from "../../lib/types.ts";

export type NunjucksRuleOpts = {
  templatePath: string;
  options?: {
    autoescape?: boolean;
    throwOnUndefined?: boolean;
    trimBlocks?: boolean;
    lstripBlocks: boolean;
    tags?: {
      blockStart?: string;
      blockEnd?: string;
      variableStart?: string;
      variableEnd?: string;
      commentStart?: string;
      commentEnd?: string;
    };
  };
};

export const getRule = (
  opts?: NunjucksRuleOpts,
  compilerOpts?: FileCompilerOptions
) => {
  // templates --> /current/working/directory/src/templates
  const templatePath = `${Deno.cwd()}/${compilerOpts?.baseDir ??
    ""}/${opts?.templatePath || `${compilerOpts
    ?.srcDir}/templates`}/`;;

  const renderNunjucks: ProcessFileRule = (input: string): string => {
    try {
      nunjucks.configure(templatePath, opts?.options ?? null)
      return nunjucks.renderString(input).replaceAll("\r", "");
    } catch (e) {
      console.error("Failed to apply template from path", templatePath);
      console.error(e);
      return input;
    }
  };

  const rule = {
    name: "nunjucks",
    process: renderNunjucks,
  };

  const ruleset: RuleSet = {
    preFileRules: [rule],
  };

  return ruleset;
};

export default getRule;
