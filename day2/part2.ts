import * as fs from 'fs';

class Part2 {
    private input: string[];
    private total: number;
    constructor() {
        this.input = [];
        this.total = 0;
    }

    public parseInput(fileName: string): void {
        this.input = fs.readFileSync(`./${fileName}.txt`, 'ascii').trim().split(',');
    }

    private getIDRanges(ranges: string): [number, number] {
        const parts = ranges.split('-').map(n => parseInt(n));

        if (!this.isValidRangeParts(parts)) {
            throw new Error(`Invalid range: ${ranges}`);
        }

        return parts;
    }

    private isValidRangeParts(parts: number[]): parts is [number, number] {
        return (
            parts.length === 2 &&
            parts.every(n => !Number.isNaN(n))
        );
    }

    private getCharMap(str: string): Map<string, number> {
        const charMap = new Map<string, number>(); 
        for (const letter of str) {
            const curr = charMap.get(letter);
            if (curr) {
                charMap.set(letter, curr + 1);
            } else {
                charMap.set(letter, 1);
            }
        }
        return charMap;
    }

    private isPalindrome(nString: string): boolean {
        const len = nString.length;
        if (len % 2 !== 0) return false;
        const half = (len / 2);
        return nString.slice(0, half) === nString.slice(half, len); 
    }

    private sequenceInvalid(nString: string, separator: number): boolean {
        let invalidId: boolean = true;
        const sequence: string = nString.slice(0, separator);
        for (let i = separator; i < nString.length; i += separator) {
            if (nString.slice(i, i + separator) !== sequence) invalidId = false;
        }
        return invalidId;
    }  
       
    private isRepeating(nString: string): boolean {
        const stringMap = this.getCharMap(nString);
        
        // String is all 1 number
        if (stringMap.size === 1) return true;
        
        const counts: number[] = stringMap.values().map(v => v).toArray();
        const countSet = new Set(counts);

        const potential: boolean = countSet.size === 1;
        const frequency = counts[0];
        if (potential && frequency !== 1) {
            const separator = nString.length / frequency!;
            return this.sequenceInvalid(nString, separator);
        }
        return false;
    }
    
    private isInvalidID(n: number): boolean {
        const nString = n.toString();
        if (nString.length === 1) return false;
        return this.isPalindrome(nString) || this.isRepeating(nString);
    }

    private solve() {
        for (const idRange of this.input) {
            console.log(idRange);
            const [start, end] = this.getIDRanges(idRange);
            for (let i = start; i < end + 1; i++) {
                if (this.isInvalidID(i)) {
                    this.total += i;
                    console.log("\t",i);
                }
            }
        }
    }

    public run(fileName: string): number { 
        this.parseInput(fileName);
        this.solve();
        console.log(this.total);
        return this.total;
    }
}

const solution = new Part2();
// solution.run('exampleInput');
solution.run('input');

// 44143124678 is too high
