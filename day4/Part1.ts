import * as fs from 'fs';

class Part1 {
    private input: string[][];
    private maxX: number;
    private maxY: number;
    private totalRolls: number;
    private display: string[][];

    constructor(fileName: string) {
        this.input = this.parseInput(fileName);
        this.maxY = this.input.length;
        this.maxX = this.input[0]!.length;
        this.totalRolls = 0;
        this.display = this.input.map(row => [...row]);
    }

    private parseInput(fileName: string) {
        return fs.readFileSync(`${fileName}.txt`, 'utf-8').trim().split("\n").map(str => str.trim().split(""));
    }

    private rollCanBeAccessed(x: number, y: number): boolean {
        let nearbyRolls: number = 0;
        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                if (i == y && j == x) continue;
                if (i < 0 || i >= this.maxY || j < 0 || j >= this.maxX) continue;
                if (this.input[i]![j]! === "@") {
                    nearbyRolls++;
                };
            }
        }
        // console.log("(x,y):","(",x,",",y,")");
        // console.log("Nearby Rolls: " + nearbyRolls);
        // console.log();
        if (nearbyRolls < 4) {
            this.display[y]?.splice(x, 1,"x");
        }
        return nearbyRolls < 4;
    }

    private solve() {
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                if (this.input[y]![x] === "@" && this.rollCanBeAccessed(x, y)) this.totalRolls++;
            }
        }
    }

    private printDisplay(display: string[][]) {
        console.log();
        const text = display.map(line => line.join()).join("\n");
        console.log(text);
    }

    public run(): number {
        // this.printDisplay(this.display);
        this.solve();
        // this.printDisplay(this.display);
        return this.totalRolls;
    }
}

// const solution = new Part1("exampleInput");
const solution = new Part1("input");
console.log(solution.run());

