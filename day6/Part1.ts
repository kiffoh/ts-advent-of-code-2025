import * as fs from 'fs';
interface Homework {
    numbers: number[];
    operator?: string;
}
class Part1 {
    private input: Map<number, Homework>;
    private total: number;
    constructor(fileName:string) {
        this.input = new Map();
        this.parseInput(fileName);
        this.total = 0;
    }

    private parseInput(fileName: string): void {
        const file: string[] = fs.readFileSync(`./${fileName}.txt`, 'utf-8').trim().split("\n");
        // could I do line here and read the file a line at a time?

        // Numbers
        let i = 0;
        for (; i < file.length - 1; i++) {
            const elements: number[] = file[i]!.trim().split(/[ \r?]+/).map(element => parseInt(element));
            for (let j = 0; j < elements.length; j++) {
                const existing = this.input.get(j);
                if (existing) {
                    existing.numbers.push(elements[j]!);
                } else {
                    this.input.set(j, {numbers: [elements[j]!]});
                }
            }
        }
        
        // Operators
        for (; i < file.length; i++) {
            const elements: string[] = file[i]!.trim().split(/[ \r?]+/);
            for (let j = 0; j < elements.length; j++) {
                const existing = this.input.get(j)!;
                existing.operator = elements[j]!;
            }
        }
    }

    private calculate(a: number, op: string, b: number) {
        const ops: Record<string, (x: number, y: number) => number> = {
            '+': (x,y) => x + y,
            '*': (x,y) => x * y,
        };

        const func = ops[op];
        if (!func) throw new Error('Invalid operator');

        return func(a,b);
    }

    private applyOperator(value: Homework): number {
        let starting = value.numbers[0]!;
        for (let i = 1; i < value.numbers.length; i++) {
            starting = this.calculate(starting, value.operator!, value.numbers[i]!);
        }
        return starting;
    }

    run() {
        this.input.forEach((value) => this.total += this.applyOperator(value));
        console.log(this.total);
    }
}

// const solution = new Part1('example');
const solution = new Part1('input');
solution.run();
