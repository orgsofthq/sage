// Parses and transforms text, e.g. for markdown

import {
  compile as baseCompile,
  compileAll as baseCompileAll,
  CompilerOptions,
  compileString as baseCompileString,
  defaultDebounceTimeMs,
  FileCompilerOptions,
} from "./compiler.ts";
import watcher from "./watcher.ts";

export type {
  CompilerFileSource,
  CompilerStringSource,
  CompilerOptions,
  MultiRulesetOptions,
} from "./compiler.ts";

// Default configuration
const defaultBaseDir = null;
const defaultSrcDir = "src";
const defaultDstDir = "public";
export const defaultOptions: CompilerOptions = {
  rulesets: ["standard"],
  rulesetOpts: {},
  inlineRules: [],
  metaRules: [],
  preFileRules: [],
  postFileRules: [],
  directoryRules: [],
  debounceTimeMs: defaultDebounceTimeMs,
  debug: {
    logCompileTime: true,
    outputTokens: false,
  },
};
export const defaultFileOptions: FileCompilerOptions = {
  ...defaultOptions,
  baseDir: defaultBaseDir,
  srcDir: defaultSrcDir,
  dstDir: defaultDstDir,
  outputExtension: "html"
};
// --- End

const compileStringRule = async (text: string, rulePath: string) => {
  const ruleModule = await import(`../rules/${rulePath}`);
  const rule = ruleModule.default;
  const output = rule.process({ text, rules: [] });
  return output[0]?.text ?? text;
};

const compileStringRuleset = async (text: string, ruleset: string) => {
  return await compileString(text, {
    rulesets: [ruleset],
  });
};

const compile = (file: string, opts?: FileCompilerOptions) => {
  const fullOpts = { ...defaultFileOptions, ...(opts || {}) };
  return baseCompile(file, fullOpts);
};

const compileAll = (opts?: FileCompilerOptions) => {
  const fullOpts = { ...defaultFileOptions, ...(opts || {}) };
  return baseCompileAll(fullOpts);
};

const compileString = async (
  input: string,
  opts?: CompilerOptions
): Promise<string> => {
  const fullOpts = { ...defaultOptions, ...(opts || {}) };
  return await baseCompileString(input, fullOpts);
};

const watch = async (opts?: FileCompilerOptions) => {
  const fullOpts = { ...defaultFileOptions, ...(opts || {}) };
  await watcher(
    `${fullOpts.baseDir != null ? `${fullOpts.baseDir}/` : ""}${
      fullOpts.srcDir
    }/`,
    baseCompileAll(fullOpts)
  );
};

export {
  compile,
  compileAll,
  compileString,
  watch,
  compileStringRule,
  compileStringRuleset,
};

export default async (opts?: CompilerOptions | null) =>
  await watch({ ...defaultFileOptions, ...(opts || {}) });
