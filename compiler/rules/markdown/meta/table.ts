import { createMetaRule } from "../../../lib/rules.ts";
import { InlineToken, LineToken } from "../../../lib/types.ts";
import {
  name as tableRuleName,
  regex as tableRuleRegex,
  rowRegex
} from "../inline/table.ts";

const name = "table"

const regex = new RegExp(tableRuleRegex, "g");
const tableRowRegex = new RegExp(rowRegex, 'g')

const MAX_ITERS = 50;

const getCols = (line: string): string[] => {
  const cols = [];
  let m;
  let i = 0;
  regex.lastIndex = 0; // reset
  while ((m = tableRowRegex.exec(line)) !== null && i++ < MAX_ITERS) {
    if (m.index === tableRowRegex.lastIndex) {
      tableRowRegex.lastIndex++;
    }
    cols.push(m[1].trim());
  }
  return cols;
};

const process = (lineTokens: LineToken[]): LineToken[] => {
  const outLineTokens: LineToken[] = [...lineTokens];

  // track level of depth, made preLi and postLi arrays
  let preToken: InlineToken | null = null;
  let postToken: InlineToken | null = null;
  let inHeader = false;

  for (let i = 0; i < outLineTokens.length; i++) {
    const lt = outLineTokens[i];

    const currentTokenIsTable = lt.rules.includes(tableRuleName);
    const inTable = preToken != null;
    if (!currentTokenIsTable && inTable) {
      // Ended table, write out
      postToken = lt.subtokens[0];
      //${postToken!.text}
      postToken!.text = `</tbody>\n</table>\n`;
      lt.subtokens = [postToken]

      preToken = null;
      postToken = null;
    } else if (currentTokenIsTable && !inTable) {
      // This is the header row
      inHeader = true;

      const cols = getCols(
        lt.subtokens.map((x) => x.text).join(""),
      );
      const ths = `${cols.map((name) => `<th>${name}</th>`).join("")}`;

      const token = lt.subtokens[0];
      token.text = `<table>\n<thead>\n<tr>${ths}</tr>\n</thead>`;
      lt.subtokens = [token];

      preToken = token;
    } else if (inHeader) {
      // second line |---|---|
      // is useless, use to start body
      const token = lt.subtokens[0];
      token.text = "<tbody>";
      lt.subtokens = [token];
      inHeader = false;
    } else if (inTable) {
      // body line
      const cols = getCols(lt.subtokens.map((x) => x.text).join(""));
      const tds = `${cols.map((name) => `<td>${name}</td>`).join("")}`;
      
      const token = lt.subtokens[0]
      token.text = `<tr>${tds}</tr>`;
      lt.subtokens = [token]
    }
  }
  return outLineTokens;
};

export default createMetaRule(name, process)