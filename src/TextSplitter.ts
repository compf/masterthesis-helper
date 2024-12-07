const ignore=["\\item","\\hline","\\lstdefinelanguage{","\\label","\\usepackage"];
export abstract class TextSplitter {
   abstract  getSplitRegex(): RegExp;
   shallIgnore(text: string): boolean {
      return ignore.some((it) => text.includes(it));
   }
   getName(): string {
      return this.constructor.name;
   }
   split(text: string): string[] {
      return text.split(this.getSplitRegex());
   }
}


export class SentenceSplitter extends TextSplitter {
   getSplitRegex(): RegExp {
      return /\./;
   }
}

export class ParagraphSplitter extends TextSplitter {
   getSplitRegex(): RegExp {
      return /\n\n/;
   }
}

export class LatexSectionSplitter extends TextSplitter {
   getSplitRegex(): RegExp {
      return /section\{/;
   }
}