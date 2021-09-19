// Common functions for rules which replace a string
import { InlineToken, ProcessInlineRule } from "./types.ts";

// Regex capturing groups conform to:
// (pre) (content|content_alt|content_alt2) (post)
// <tag> is inserted after pre, </tag> inserted before post
// All other captured groups will be discarded
export const replaceTag = (
  rulename: string,
  regex: RegExp,
  tag: string,
  attributes?: { [key: string]: string },
): ProcessInlineRule =>
  (token: InlineToken): InlineToken[] | null => {
    const match = regex.exec(token.text);
    if (match == null) {
      return null;
    }
    const tokens = [];
    if (match.groups!.pre != null) {
      tokens.push({
        text: match.groups!.pre,
        rules: token.rules,
      });
    }
    const content = match.groups!.content ??
      match.groups!.content_alt ??
      match.groups!.content_alt2;

    let attr = attributes || {};
    const attributeString = Object.keys(attr).reduce(
      (prev, key) => `${prev}${key}=\"${attr[key]}\" `,
      "",
    ).trim();

    if (content != null) {
      tokens.push({
        text: `<${tag}${
          attributeString.length > 0 ? ` ${attributeString}` : ``
        }>${content}</${tag}>`,
        rules: token.rules.concat(rulename),
      });
    }
    if (match.groups!.post != null) {
      tokens.push({
        text: match.groups!.post,
        rules: token.rules,
      });
    }
    return tokens;
  };

// Regex capturing groups conform to:
// (pre) (content|content_alt|content_alt2) (post)
// arg "a" is inserted before content, arg "b" inserted after content
// All other captured groups will be discarded
export const replacePair = (
  rulename: string,
  regex: RegExp,
  a: string,
  b: string,
  singleToken?: boolean,
): ProcessInlineRule =>
  (token: InlineToken): InlineToken[] | null => {
    const match = regex.exec(token.text);
    if (match == null) {
      return null;
    }

    const tokens = [];
    if (match.groups!.pre != null) {
      tokens.push({
        text: match.groups!.pre,
        rules: token.rules,
      });
    }
    const content = match.groups!.content ??
      match.groups!.content_alt ??
      match.groups!.content_alt2;

    if (content != null) {
      tokens.push({
        text: `${a}${content}${b}`,
        rules: token.rules.concat(rulename),
      });
    }
    if (match.groups!.post != null) {
      tokens.push({
        text: match.groups!.post,
        rules: token.rules,
      });
    }

    if (singleToken) {
      return {
        // @ts-ignore should be fine
        text: tokens.reduce((prev, token) => `${prev}${token.text}`, ""),
        rules: token.rules.concat(rulename),
      };
    }

    return tokens;
  };

// Regex capturing groups conform to:
// (pre) (post)
// arg "string" will be inserted in between them
export const replaceString = (
  rulename: string,
  regex: RegExp,
  string: string,
): ProcessInlineRule =>
  (token: InlineToken): InlineToken[] | null => {
    const match = regex.exec(token.text);
    if (match == null) {
      return null;
    }
    const tokens = [];
    if (match.groups!.pre != null) {
      tokens.push({
        text: match.groups!.pre,
        rules: token.rules,
      });
    }

    tokens.push({
      rules: token.rules.concat(rulename),
      text: `${string}`,
    });

    if (match.groups!.post != null) {
      tokens.push({
        text: match.groups!.post,
        rules: token.rules,
      });
    }
    return tokens;
  };

// Compose multiple replacement functions in one function, each will be applied in order
export const replaceCompose = (processFns: ProcessInlineRule[]) =>
  (token: InlineToken): InlineToken[] | null => {
    for (const fn of processFns) {
      const result = fn(token);
      if (result != null) {
        return result;
      }
    }
    return null;
  };
