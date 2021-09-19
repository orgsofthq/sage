import { CompilerFileSource } from "../compiler.ts";
import { DirectoryRule, FileRule } from "../lib/types.ts";

export default function (
  source: CompilerFileSource,
  directoryRules: DirectoryRule[],
): void {
  for (const rule of directoryRules) {
    rule.process(source);
  }
}
