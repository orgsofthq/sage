import { InlineRule, MetaRule, RuleSet } from "../../lib/types.ts";

type RulesetOptions = {

}

export const getRuleset = async (opts?: RulesetOptions) => {
  const inlineRules: InlineRule[] = [
    // Helpers
    await import("./inline/empty_line.ts"),
    await import("./inline/blockcode-fence.ts"),
  
    // // Other early
    await import("./inline/table.ts"),
    await import("./inline/checkbox.ts"),
    await import("./inline/ordered-list-item.ts"),
    await import("./inline/unordered-list-item.ts"),
    await import("./inline/headers.ts"),
    await import("./inline/hr.ts"),
    await import("./inline/ltgt.ts"),
  
    // // Complex tags
    await import("./inline/image.ts"),
    await import("./inline/link.ts"),
  
    // // Simple tags
    await import("./inline/code.ts"),
    await import("./inline/bold.ts"),
    await import("./inline/italic.ts"),
    // await import("./inline/blockquotes.ts"),
    await import("./inline/strikethrough.ts"),
    await import("./inline/ins.ts"),
  
    // // Simple replacements
    // await import("./inline/newline.ts"),
  
    // // Late, cleanup
    await import("./inline/empty_string.ts"),
    
  ].map((x) => x.default);
  
  const metaRules: MetaRule[] = [
    await import("./meta/collapse-emptylines.ts"),
    await import("./meta/list.ts"),
    // await import("./meta/code.ts"),
    await import("./meta/table.ts"),
    await import("./meta/paragraph.ts"),
  ].map((x) => x.default);

  return {
    inlineRules,
    metaRules,
  };
};

export default getRuleset