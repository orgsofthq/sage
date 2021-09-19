import { assertEquals } from "../deps/std.ts";

import { compileString } from "../compiler/mod.ts";

const compileHtml = async (input: string) =>
  await compileString(input, { rulesets: ["html"] });

Deno.test("preamble html", async () => {
  const input = "Text";
  const expectedOutput =
    `<!doctype html><meta charset="UTF-8"><script type="text/javascript" src="https://livejs.com/live.js"></script>Text`;
  const actualOutput = await compileHtml(input);
  assertEquals(actualOutput, expectedOutput);
});

Deno.test("custom html", async () => {
  const input = "Text";
  const opts = {
    preamble: "[pre]",
    postamble: "[post]",
    liveReload: false,
  };
  const expectedOutput = `<!doctype html><meta charset="UTF-8">[pre]Text[post]`;
  const actualOutput = await compileString(input, {
    rulesets: ["html"],
    rulesetOpts: { "html": opts },
  });
  assertEquals(
    actualOutput,
    expectedOutput,
  );
});
