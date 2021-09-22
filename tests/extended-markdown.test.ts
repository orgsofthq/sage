import { assertEquals } from "../deps/std.ts";

import { compileString } from "../compiler/mod.ts";

const compileMd = async (input: string) =>
  await compileString(input, { rulesets: ["extended-markdown"] });

Deno.test("extended markdown: backlink", async () => {
    assertEquals(
      await compileMd("[[Sources used linked here.|sources]]"),
      `<p><a href="sources">Sources used linked here.</a></p>`
    )
  })