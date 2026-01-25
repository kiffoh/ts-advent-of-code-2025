import * as fs from 'fs';

class Part1 {
    input: [number, number][];
    areas: number[];
    maxArea: number;

    constructor(fileName: string) {
        this.input = this.parseInput(fileName);
        this.areas = [];
        this.maxArea = 0;
    }



    private parseInput(fileName: string): [number, number][] {
        const page = fs.readFileSync(`${fileName}.txt`, 'utf-8').trim().split(/\r\n/);
        const stringTuples = page.map(str => str.trim().split(",")) as [string, string][];
        return stringTuples.map((tuple) => [parseInt(tuple[0]), parseInt(tuple[1])]);
    }

    private calculateAreas() {
        for (let i = 0; i < this.input.length; i++) {
            const [a1, b1] = this.input[i]!;
            for (let j = i + 1; j < this.input.length; j++) {
                const [a2, b2] = this.input[j]!;
                const area = Math.abs(a1 - a2 + 1) * Math.abs(b1 - b2 + 1);
                this.areas.push(area);
            }
        }
        this.maxArea = Math.max(...this.areas);
    }

    run() {
        this.calculateAreas();
        console.log(this.maxArea);
    }
}

// const solution = new Part1('example');
const solution = new Part1('input');
solution.run();

