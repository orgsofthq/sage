import { assertEquals } from "../deps/std.ts";

import { compileString } from "../compiler/mod.ts";

Deno.test("full simple test", async () => {
  const input = "# sup(tm) 8)";
  const expectedOutput =
    `<!doctype html><meta charset="UTF-8"><script type="text/javascript" src="https://livejs.com/live.js"></script><h1 id="suptm-8">sup™ 😎</h1>`;
  assertEquals(await compileString(input), expectedOutput);
});
