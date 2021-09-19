import { compileStringRuleset } from "../compiler/mod.ts";
import { assertEquals } from "../deps/std.ts";

Deno.test("apply single markdown rule", async () => {
  const input = "## Test **it**";
  const expectedOutput = `<h2 id="test-it">Test <strong>it</strong></h2>`;
  const actualOutput = await compileStringRuleset(input, "markdown");
  assertEquals(actualOutput, expectedOutput);
});

Deno.test("apply standard markdown ruleset", async () => {
  const input = "Text";
  const expectedOutput = `<!doctype html><meta charset="UTF-8"><script type="text/javascript" src="https://livejs.com/live.js"></script><p>Text</p>`;
  const actualOutput = await compileStringRuleset(input, "standard");
  assertEquals(actualOutput, expectedOutput);
});
