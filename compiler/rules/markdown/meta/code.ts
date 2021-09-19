// import { LineToken } from "../../../lib/types.ts";
// import blockCode from "../inline/blockcode-fence.ts"

// const indentRegex = /(?<indent>\s+)(?<sym>\*|\+|\-)\s+(?<content>.*)/;

// const preTag = "<pre><code>";
// const postTag = "</code></pre>";

// export const process = (lineTokens: LineToken[]): LineToken[] => {
//   const outLineTokens: LineToken[] = [...lineTokens];

//   // track level of depth, made preLi and postLi arrays
//   let preLine: LineToken | null = null;
//   let postLine: LineToken | null = null;

//   for (let i = 0; i < outLineTokens.length; i++) {
//     const lt = outLineTokens[i];
    
//     const currentTokenIsCodeFence = lt.rules.includes(blockCode.name)
//     const inCodeFence = preToken != null

//     if (currentTokenIsCodeFence && inCodeFence) {
//       // Ended
//       postToken = lt
//       preToken!.text = preTag
//       postToken!.text = postTag
      
//       preToken = null
//       postToken = null
//     }
//     else if (currentTokenIsCodeFence && !inCodeFence) {
//       preToken = lt
//     }
//   }
//   return outLineTokens;
// };
