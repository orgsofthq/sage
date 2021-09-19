import { FileRule } from "../lib/types.ts";

export default function (
  input: string,
  fileRules: FileRule[],
): string {
  let output = input;
  for (const rule of fileRules) {
    output = rule.process(output);
  }
  return output;
}
