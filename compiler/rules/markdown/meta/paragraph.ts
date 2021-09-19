import { LineToken, MetaRule } from "../../../lib/types.ts";

const name = "paragraph";
const process = (lineTokens: LineToken[]): LineToken[] => {
  const outLineTokens: LineToken[] = [...lineTokens];

  let preLine: LineToken | null = null;
  let postLine: LineToken | null = null;

  // Accumulate until newline OR block
  for (let i = lineTokens.length - 1; i >= 0; i--) {
    const lt = lineTokens[i];

    const wasParagraph = postLine != null;

    // Not a block (e.g. table, empty line) or plain w/ HTML tag.
    const isParagraph = !lt.block &&
      !(lt.rules.includes("plain") &&
        /^\s*\</.test(lt.subtokens[0]?.text || ""));

    const isEndOfParagraph = (!isParagraph && wasParagraph) ||
      (i === 0 && isParagraph) ||
      (i === 0 && wasParagraph);

    if (isEndOfParagraph) {
      // Ended paragraph
      if (i === 0) {
        // Special case for last line
        preLine = lt;
        if (postLine == null) {
          postLine = lt;
        }
      }

      const preToken = preLine!.subtokens[0];
      const postToken = postLine!.subtokens[postLine!.subtokens.length - 1];
      preToken.text = `<p>${preToken.text}`;
      postToken.text = `${postToken.text}</p>`;
      preLine = null;
      postLine = null;
    } else if (isParagraph && !wasParagraph) {
      // Entered new paragraph
      preLine = lt;
      postLine = lt;
    } else if (isParagraph && wasParagraph) {
      // In same paragraph
      preLine = lt;
    } else {
      // Ignore
    }
  }
  return outLineTokens;
};

const rule: MetaRule = {
  name,
  process,
};
export default rule;
