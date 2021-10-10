import { createHash } from "../deps/std.ts";
import { iter } from "../deps/std.ts";
import { debounce } from "../deps/debounce.ts";
import {
  DirectoryRule,
  FileRule,
  InlineRule,
  MetaRule,
  RuleSet,
} from "./lib/types.ts";

import applyInline from "./steps/step-inline.ts";
import applyMeta from "./steps/step-meta.ts";
import applyFile from "./steps/step-file.ts";
import applyPrintEachLine from "./steps/step-print-each-line.ts";
import applyPrintFile from "./steps/step-print-file.ts";
import applyDirectory from "./steps/step-directory.ts";

import { printInlineTokenDebug } from "./steps/step-print-debug.ts";

export type MultiRulesetOptions = Record<string, RulesetOptions>;
export type RulesetOptions = Record<string, unknown>;

export type DebugOptions = {
  logCompileTime: boolean;
  outputTokens: boolean;
};

export type CompilerStringSource = {
  input: string;
};

export type CompilerFileSource = {
  baseDir: string | null;
  srcDir: string;
  dstDir: string;
  outputExtension: string
};

export type CompilerOptions = {
  rulesets?: string[];
  rulesetOpts?: MultiRulesetOptions;
  inlineRules?: InlineRule[];
  metaRules?: MetaRule[];
  preFileRules?: FileRule[];
  postFileRules?: FileRule[];
  directoryRules?: DirectoryRule[];
  debounceTimeMs?: number;
  debug?: DebugOptions;
};

export type FileCompilerOptions = CompilerOptions & CompilerFileSource;

export const defaultDebounceTimeMs = 100;

type CompileInfo = {
  path: string;
  hash: string;
  compile: (...input: unknown[]) => unknown;
};

const compilations: { [key: string]: CompileInfo } = {};

const resolveRulesets = async (
  rulesetStrs: string[] | undefined,
  rulesetOpts: MultiRulesetOptions | undefined,
  compilerOpts: CompilerOptions,
): Promise<RuleSet[]> => {
  return await Promise.all(
    (rulesetStrs || []).map(async (rule: string) =>
      (
        await import(`./rules/${rule}/ruleset.ts`)
      ).default((rulesetOpts || {})[rule] ?? undefined, compilerOpts)
    ),
  );
};

export const compileString = async (
  input: string,
  opts: CompilerOptions,
): Promise<string> => {
  const { rulesets: rulesetStrs, rulesetOpts, debug } = opts;

  const rulesets = await resolveRulesets(rulesetStrs, rulesetOpts, opts);

  const inlineRules: InlineRule[] = [
    ...(rulesets != null ? rulesets!.flatMap((r) => r.inlineRules || []) : []),
    ...(opts.inlineRules ?? []),
  ];
  const metaRules: MetaRule[] = [
    ...(rulesets != null ? rulesets!.flatMap((r) => r.metaRules || []) : []),
    ...(opts.metaRules ?? []),
  ];
  const preFileRules: FileRule[] = [
    ...(rulesets != null ? rulesets!.flatMap((r) => r.preFileRules || []) : []),
    ...(opts.preFileRules ?? []),
  ];
  const postFileRules: FileRule[] = [
    ...(rulesets != null
      ? rulesets!.flatMap((r) => r.postFileRules || [])
      : []),
    ...(opts.postFileRules ?? []),
  ];

  let content: string = input;
  content = applyFile(content, preFileRules);

  const lineTokens = applyMeta(applyInline(content, inlineRules), metaRules);

  if (debug?.outputTokens) {
    content = printInlineTokenDebug(lineTokens);
  } else {
    const lines = applyPrintEachLine(lineTokens);
    content = applyPrintFile(lines);
  }

  content = applyFile(content, postFileRules);
  return content;
};

export const compile = (file: string, opts: FileCompilerOptions) =>
  debounce(
    async () => {
      // console.clear();
      const { baseDir, srcDir, dstDir } = opts;

      const text = await Deno.readTextFile(
        `${baseDir ?? "."}/${srcDir}/${file}`,
      );

      const content = await compileString(text, opts);

      const dstPath = `${baseDir ?? "."}/${dstDir}`;
      const dstFile = `${dstPath}/${file.replace(".md", `.${opts.outputExtension}`)}`;

      await Deno.mkdir(dstPath, { recursive: true });
      await Deno.writeTextFile(dstFile, content);
    },
    opts.debounceTimeMs ?? defaultDebounceTimeMs,
    false,
  );

const getFileHash = async (file: string, srcDir: string) => {
  const openFile = await Deno.open(`${srcDir}/${file}`);
  const hash = createHash("md5");
  for await (const chunk of iter(openFile)) {
    hash.update(chunk);
  }
  Deno.close(openFile.rid);
  return hash.toString();
};

export const compileAll = (opts: FileCompilerOptions) =>
  debounce(
    async () => {
      const { baseDir, srcDir, debug } = opts;

      const fullSrcDir = `${baseDir != null ? `${baseDir}/` : ""}${srcDir}`;
      // console.clear();
      const allStartTime = Date.now();
      const files = await Deno.readDir(fullSrcDir);
      for await (const file of files) {
        const startTime = Date.now();
        if (
          !file.isFile || (!file.name.endsWith(".md") &&
            !file.name.endsWith(".html") && !file.name.endsWith(".xml"))
        ) {
          continue;
        }

        const hash = await getFileHash(file.name, fullSrcDir);

        let cInfo = compilations[file.name];

        const dirty = cInfo == null || cInfo.hash != hash;

        if (!dirty) {
          continue;
        }

        if (cInfo == null) {
          cInfo = {
            path: file.name,
            hash: hash,
            compile: compile(file.name, opts),
          };
          compilations[file.name] = cInfo;
        } else {
          cInfo.hash = hash;
        }

        if (debug?.logCompileTime) console.log("Compiling", cInfo.path);
        await cInfo.compile();
        if (debug?.logCompileTime) {
          console.log(`Compiled ${cInfo.path} in ${Date.now() - startTime}ms`);
        }
      }

      const rulesets = await resolveRulesets(
        opts.rulesets,
        opts.rulesetOpts,
        opts,
      );

      const dirRules: DirectoryRule[] = [
        ...(rulesets != null
          ? rulesets!.flatMap((r) => r.directoryRules || [])
          : []),
        ...(opts.directoryRules ?? []),
      ];

      await applyDirectory({
        baseDir: opts.baseDir,
        srcDir: opts.srcDir,
        dstDir: opts.dstDir,
        outputExtension: opts.outputExtension
      }, dirRules || []);

      if (debug?.logCompileTime) {
        console.log(`Compiled all in ${Date.now() - allStartTime}ms`);
      }
    },
    opts.debounceTimeMs ?? defaultDebounceTimeMs,
    false,
  );
