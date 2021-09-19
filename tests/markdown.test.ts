import { assertEquals } from "../deps/std.ts";

import { compileString } from "../compiler/mod.ts";

const compileMd = async (input: string) =>
  await compileString(input, { rulesets: ["markdown"] });

Deno.test("h1 markdown", async () => {
  assertEquals(
    await compileMd("# Hello universe!"),
    '<h1 id="hello-universe">Hello universe!</h1>'
  );
});

Deno.test("h4 markdown", async () => {
  assertEquals(
    await compileMd("#### Hello universe!"),
    '<h4 id="hello-universe">Hello universe!</h4>'
  );
});

Deno.test("bold italic markdown", async () => {
  assertEquals(
    await compileMd("**Best** *test* in the west"),
    "<p><strong>Best</strong> <i>test</i> in the west</p>"
  );
});

Deno.test("image markdown", async () => {
  assertEquals(
    await compileMd(
      "![CC0 logo](https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Public_Domain_Mark_button.svg)"
    ),
    `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Public_Domain_Mark_button.svg" title="CC0 logo" />`
  );
});

Deno.test("table", async () => {
  const input = `
| Column 0 | Column 1 | !@!@! |
| --- | --- | ---|
| haha asdf | 123-lol | hm |
  `;

  const actualOutput = await compileMd(input);
  const expectedOutput = `<table>
<thead>
<tr><th>Column 0</th><th>Column 1</th><th>!@!@!</th></tr>
</thead>
<tbody>
<tr><td>haha asdf</td><td>123-lol</td><td>hm</td></tr>
</tbody>
</table>
`;

  assertEquals(actualOutput, expectedOutput);
});

Deno.test("formatting in link", async () => {
  assertEquals(
    await compileMd("[The best link](wikipedia.org/**yeet**)"),
    `<p><a href="wikipedia.org/**yeet**">The best link</a></p>`
  );
});
