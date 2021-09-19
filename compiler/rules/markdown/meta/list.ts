import { MetaRule, LineToken } from "../../../lib/types.ts";

const indentRegex = /(?<indent>\s+)(?<sym>\*|\+|\-)\s+(?<content>.*)/;

const unorderedTag = "ul";
const orderedTag = "ol";

const name = "list";

const process = (lineTokens: LineToken[]): LineToken[] => {
  const outLineTokens: LineToken[] = [...lineTokens];

  // track level of depth, made preLi and postLi arrays
  let firstLi: LineToken | null = null;
  let lastLi: LineToken | null = null;
  let currentListItemType = "none";
  let depth = 0;

  for (let i = 0; i < outLineTokens.length; i++) {
    const lt = outLineTokens[i];
    const listItemType = lt.rules.includes("ordered-list-item")
      ? "ordered"
      : lt.rules.includes("unordered-list-item")
      ? "unordered"
      : "none";

    if (
      (i == outLineTokens.length - 1 || currentListItemType != listItemType) &&
      currentListItemType != "none"
    ) {
      // Ended a list, write
      const tag = currentListItemType === "ordered" ? orderedTag : unorderedTag;
      firstLi!.subtokens[0].text = `<${tag}>${firstLi!.subtokens[0].text}`;
      lastLi!.subtokens[lastLi!.subtokens.length - 1].text = `${lastLi!.subtokens[lastLi!.subtokens.length - 1].text}</${tag}>`;
      firstLi = null;
      lastLi = null;
      currentListItemType = "none";
      depth--;
    } else if (currentListItemType == listItemType && listItemType != "none") {
      // Following a list
      lastLi = lt;
    } else if (listItemType != "none") {
      // Starting a new list
      currentListItemType = listItemType;
      firstLi = lt;
      lastLi = lt;
      depth++;
    }
  }
  return outLineTokens;
};

const rule: MetaRule = {
  name,
  process,
};

export default rule;
