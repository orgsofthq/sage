import { InlineToken, LineToken } from "../lib/types.ts";

const name = "compiler-step-print-lines";

export default function (input: LineToken[]): string[] {
  return input.map(
    (x: LineToken): string =>
      // @ts-ignore reduce type is different
      x.subtokens.reduce(
        (prev: string, cur: InlineToken) => `${prev}${cur.text}`,
        "",
      ),
  );
}
