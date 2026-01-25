import * as fs from 'fs';
class Battery {
    public int: number;
    public str: string;
    constructor(str: string) {
        this.int = parseInt(str);
        this.str = str;
    }
}
class Part1 {
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
        let bat1 = bank[0]!;
        let bat2 = new Battery("0");

        for (let i = 1; i < bank.length; i++) {
            const curr = bank[i]!;
            if (curr.int > bat1.int && i < bank.length - 1) {
                bat1 = curr;
                bat2 = bank[i + 1]!;
                // console.log("\tBAT1 change");
                // console.log("\t",bat1.str + bat2.str)
            } else if (curr.int > bat2.int) {
                bat2 = curr;
                // console.log("\tBAT2 change");
                // console.log("\t",bat1.str + bat2.str)
            }
        }

        console.log(bat1.str + bat2.str);
        this.total += parseInt(bat1.str + bat2.str);
    }

    public run(): number {
        for (const bank of this.input) {
            // console.log(bank.map(bat => bat.str));
            this.solve(bank);
        }
        return this.total;
    }
}

// const solution = new Part1("exampleInput");
const solution = new Part1("input");
console.log(solution.run());
