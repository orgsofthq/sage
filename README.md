# Ω sage

Simple, fast, and customizable **website builder**. 

![video demo of sage](misc/demo.gif)

Aiming to support a more ideal site or text authoring workflow. 

Either use the built-in modules, or bring your own: markup language, templates, configuration, and local server.

### Features:

- **Zero configuration** needed. Just run `sage`.
- **Live reloading.** Changes show immediately in the browser when saving.
- Supports `{{ nunjucks }}` templates, \*\***Markdown**\*\*, and extensions (like
  [[[Backlinks]]](#) and Emoji 😀) out of the box.
- A simple **markup language parser** standalone module. Easy to design your own Markdown variants or alternative.
- **Modular design**. Each component – the compiler, parser, and rulesets – can be  configured, extended, or extracted to be used separately.
- **Built with [Deno](https://deno.land/)** in TypeScript.

## Using sage

Requires Deno, get it from: https://deno.land/

### Via shell

Easiest option to install and run `sage`.

Use this if you don't plan to change any code.

1. **Install**

One-line:
```sh
deno install -qAf --unstable -n sage https://raw.githubusercontent.com/organic-software/sage/main/mod.ts
```

Or, alternatively to download the source code:
```sh
git clone https://github.com/organic-software/sage/
cd sage
./scripts/install.sh
```

2. **Setup**

Navigate to the base directory of where you want your website to be, and run:

```sh
sage init
```

You can configure your site from the instructions in [Configuration](#Configuration).

3. **Build**

To host a local, live website run:

```sh
sage
```

Edit `src/index.md` to make changes.

And visit [`http://localhost:8080`](http://localhost:8080) to see your website live updating.

Alternatively, if you just want to build your site without the local server, run:

```sh
sage build
```

## Configuration

Create a `sage.json` file in your working directory, or run `sage --config my_config_file.json`. This lets you customize and debug things.

```js
{
  "debug": {
    // Shows "compiled index.md in 10ms"
    "logCompileTime": true,
    // Debug parser output, use to debug why your markup isn't doing what you wanted
    "outputTokens": false
  },
  // Which rules to apply, e.g. "markdown", "nunjucks", etc.
  // Standard contains all built-in rulesets, incl. live HTML reloading and others.
  "rulesets": ["standard"],
  // Pass arguments to configure each ruleset
  "rulesetOpts": {
    "standard": {
      "htmlOptions": {
        // Automatically reloads *.html as you develop, turn off for production
        "liveReload": true
      },
      "nunjucksOptions": {
        "templatePath": "src/templates"
      }
    }
  },
  // Root relative directory of your site
  "baseDir": "site",
  "srcDir": "src",
  "dstDir": "public"
}
```

You can alternatively pass configuration via the command line, e.g. `sage --srcDir "src" --dstDir "public"`. 

You can pass an `input` parameter to process a single string of text instead of an input directory, e.g. `sage --input "# Hello world"`.

## Limitations

- Markdown is not implemented fully yet, there are a handful of things won't not work (e.g. nested lists, block quotes). Feel free to put up a pull request or issue.

## Developing sage

### Via Deno CLI

This is the standard way to run & develop Deno apps. It doesn't require any
other dependencies.

1. Download repository:

```bash
git clone https://github.com/organic-software/sage && cd sage
```

2. Run:

```sh
./scripts/run.sh
```

### Via Denon

[Denon](https://github.com/denosaurs/denon) is a wrapper around Deno that
monitors for any code changes, and restarts the app if detected.

This is the recommended way to run `sage` for local changes or development.

1. Download Denon and the sage repository:

```bash
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
git clone https://github.com/organic-software/sage/mod.ts && cd sage
```

2. Run:

```bash
# Without typechecking (fast):
denon run

# Or with typechecking & debugging (slower):
denon debug
```

### Running tests

From the base `sage/` directory, run:

```sh
./scripts/test.sh
```

## Using markdown

You can use sage just to compile some Markdown, for example.

### Via CLI

```sh
> sage --rulesets "markdown" --input "**Bold** _italic_"

# outputs: <p><strong>Bold</strong> <i>italic</i></p>
```

### Via CLI and sage.json

1. Create `sage.json`:

```js
{
  "rulesets": ["markdown"]
  // ...
}
```

2. Run `sage build`

Files in `src/` will be compiled to `public/`.

### Via code

```js
import { compileString } from "https://github.com/organic-software/sage/compiler/mod.ts";
import mdRuleset from "https://github.com/organic-software/sage/compiler/rules/markdown/ruleset.ts";

const input = "# Hello universe!";
const output = compileString(input, { rulesets: [mdRuleset] });

// <h1>Hello universe!</h1>
console.log(output);
```