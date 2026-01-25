import * as fs from 'fs';
class Battery {
    public int: number;
    public str: string;
    constructor(str: string) {
        this.int = parseInt(str);
        this.str = str;
    }

    public toString() {
        return this.str;
    }
}

class Part2 {
    private input: Battery[][];
    private total: number;
    constructor(fileName: string) {
        this.input = this.parseInput(fileName);
        this.total = 0;
    }
    private parseInput(fileName: string): Battery[][] {
        const banks: string[] = fs.readFileSync(`${fileName}.txt`, 'ascii')
            .trim()
            .split("\n");

        return banks.map(bank => bank.trim().split("").map(val => new Battery(val)) as Battery[]);
    }

    private solve(bank: Battery[]) {
        const maxJoltage: Battery[] = [];
        const bankLength = bank.length;
        const batteriesLeft = 12;

        let startIndex = 0;

        for (let i = 0; i < batteriesLeft; i++) {
            const remaining = batteriesLeft - i - 1; // Batteries left after this one

            const endIndex = bankLength - remaining;
            
            let maxVal = bank[startIndex]!.int;
            let maxIdx = startIndex;
            let j = startIndex;

            while (j < endIndex) {
                if (bank[j]!.int > maxVal) {
                    maxVal = bank[j]!.int;
                    maxIdx = j;
                }
                j++;
            }

            maxJoltage.push(bank[maxIdx]!);
            startIndex = maxIdx + 1;
        }

        const final = maxJoltage.reduce((acc, curr) => acc + curr.str, "");

        console.log(final);
        this.total += parseInt(final);
    }

    public run(): number {
        for (const bank of this.input) {
            this.solve(bank);
        }
        return this.total;
    }
}

// const solution = new Part2("exampleInput");
const solution = new Part2("input");
console.log(solution.run());

// 169024493489182 - too high
