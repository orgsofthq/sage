# sage-compiler

`rules/` has all built-in rulesets. Rulesets are transformations on text, including Markdown, nunjucks, and HTML formatting.

`lib/` are common functions to help write rules. 

`steps/` are the various steps in which text transformations are applied, like per-line, per-file, and per-directory.