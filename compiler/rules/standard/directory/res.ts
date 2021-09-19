import { ProcessDirectoryRule } from "../../../lib/types.ts";
import { copy, exists, move } from "../../../../deps/std.ts";
import { CompilerFileSource } from "../../../compiler.ts";

const processRule: ProcessDirectoryRule = async (
  source: CompilerFileSource,
) => {
  // Copy all resources
  // copy(`${path}/src/res`, `${path}/public/`)
  const srcPath = `${source.baseDir || "."}/${source.srcDir}/res`;
  const dstPath = `${source.baseDir || "."}/${source.dstDir}`;

  if (!exists(srcPath)) {
    return false;
  }

  if (!exists(dstPath)) {
    await Deno.mkdir(dstPath);
  }
  try {
    await copy(srcPath, dstPath, { overwrite: true });
    return true;
  } catch (_) {
    return false;
  }
};

export default {
  name: "resources",
  process: processRule,
};
