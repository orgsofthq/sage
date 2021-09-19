import { Args, exists, parse } from "../deps/std.ts";

import compiler, {
  compileAll,
  CompilerFileSource,
  CompilerOptions,
  CompilerStringSource,
  compileString,
} from "../compiler/mod.ts";
import { defaultFileOptions } from "../compiler/mod.ts";
import server from "../server/mod.ts";

type SageOptions =
  & CompilerOptions
  & (CompilerFileSource | CompilerStringSource);

type CliArgs =
  | SageOptions
  | {
    config: string;
  };

const init = async (opts: CompilerOptions & CompilerFileSource) => {
  try {
    const baseDir = opts.baseDir;
    const srcDir = `${opts.baseDir || "."}/${opts.srcDir}`;
    const dstDir = `${opts.baseDir || "."}/${opts.dstDir}`;
    const indexFile = `${opts.baseDir || "."}/${opts.srcDir}/index.md`;

    if (baseDir != null) await Deno.mkdir(baseDir);
    await Deno.mkdir(srcDir);
    await Deno.mkdir(dstDir);
    await Deno.writeTextFile(
      indexFile,
      `# Hello world!
  Run \`sage\`, then edit \`${indexFile}\` to update this page.
      `,
    );
    console.log(`Created ${srcDir}, ${dstDir}, and ${indexFile}`);
  } catch (e) {
    console.error("Error initializing sage: ", e);
  }
};

const run = async () => {
  const args = parse(Deno.args);

  let config = {
    rulesets: args.rulesets,
    ...defaultFileOptions,
    ...args,
    input: args.input,
  };
  const configFile = args != null && (args.c || args.config) || "sage.json";
  if (configFile != null && await exists(`${Deno.cwd()}/${configFile}`)) {
    config = {
      ...config,
      ...JSON.parse(await Deno.readTextFile(configFile)),
    };
  }

  // markdown,nunjucks --> ["markdown", "nunjucks"]
  if (typeof config.rulesets == "string") {
    config.rulesets = (config.rulesets || "standard").split(",");
  }

  try {
    if (config && config.input) {
      // @ts-ignore \_o_/
      console.log(await compileString(config.input, config));
      return;
    }

    if (config && config["_"].includes("init")) {
      // sage init
      await init(config);
      return;
    }

    if (config && config["_"].includes("build")) {
      // sage build
      // @ts-ignore \_o_/
      await compileAll(config)();
      return;
    }

    // sage watch
    // @ts-ignore \_o_/
    await Promise.all([compiler(config), server(config)]);
  } catch (e) {
    console.error(
      "Exception while running sage. Make sure you have run `sage init` on the current directory, and your configuration is valid.",
      e,
    );
  }
};

export default run;
