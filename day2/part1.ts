import * as fs from 'fs';

class Part1 {
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

    private isPalindrome(n: number): boolean {
        const nString = n.toString();
        const len = nString.length;
        if (len % 2 !== 0) return false;
        const half = (len / 2);
        return nString.slice(0, half) === nString.slice(half, len); 
    }

    private solve() {
        for (const idRange of this.input) {
            const [start, end] = this.getIDRanges(idRange);
            for (let i = start; i < end + 1; i++) {
                if (this.isPalindrome(i)) {
                    this.total += i;
                    console.log('TRUE\n');
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

const part1 = new Part1();
// part1.run('exampleInput');
part1.run('input');

