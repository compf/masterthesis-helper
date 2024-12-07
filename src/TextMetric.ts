export interface TextMetric {
    measure(text: string): number;
    getName(): string;
}

export class NumberWordsPlusLettersMetric implements TextMetric {
    measure(text: string): number {
        let whiteSpaceSplit = text.split(" ");
        let numberWords = whiteSpaceSplit.length;
        let numberLetters = 0;
        for (let c of text) {
            if (c.match(/[a-zA-Z]/)) {
                numberLetters++;
            }
        }
        return numberLetters + numberWords;
    }
    getName(): string {
        return this.constructor.name;
    }
}