import * as fs from 'fs';
interface Homework {
    numbers: number[];
    operator?: string;
}
class Part25 {
    private input: Homework[];
    private total: number;
    private amountOfNumbers: number;
    private stringOfNumbers: string;
    private indexes: [number, number][];
    constructor(fileName:string) {
        this.stringOfNumbers = "0123456789";
        this.total = 0;
        this.parseInput(fileName);
    }

    private parseLine(line: string): [number,number][] {
        const output: [number, number][] = [];
        let l = 0;
        let r = 0;
        while (l < line.length) {
            if (line[l] === ' ') {
                l++;
                continue;
            }
            r = l;
            while (this.stringOfNumbers.includes(line[r]!)) {
                r++;
            }
            output.push([l, r]);
            l = r;
        }
        return output;
    }

    private condenseIndexes(allIndexes: [number, number][][]): [number, number][] {
        const result =
            allIndexes[0]!.map((_, i) => {
                const col = allIndexes.map(row => row[i]);
                return [
                Math.min(...col.map(t => t![0])),
                Math.max(...col.map(t => t![1])),
                ] as [number, number];
            });
        return result;
    }

    private getNumbers(file: string[]): string[][] {
        const numbers = [];
        for (const [l, r] of this.indexes) {
            const columnOfNumbers = [];
            for (let i = 0; i < file.length - 1; i++) {
                const line = file[i]!;
                columnOfNumbers.push(line.slice(l,r));
            }
            numbers.push(columnOfNumbers);
        }
        return numbers;
    }

    private parseInput(fileName: string): void {
        const file: string[] = fs.readFileSync(`./${fileName}.txt`, 'utf-8').trim().split("\n").map(row => row.replace("\r", ""));

        // Numbers
        const allIndexes: [number, number][][] = [];
        let i = 0;
        for (; i < file.length - 1; i++) {
            allIndexes.push(this.parseLine(file[i]!));
        }
        this.indexes = this.condenseIndexes(allIndexes);
        console.log(this.indexes);

        const numbers = this.getNumbers(file);
        
        const rearranged: number[][] = this.rearrangeNumbers(numbers);
        this.input = Array(rearranged.length)
            .fill(null)
            .map(() => ({numbers: [], operator:''}));
        rearranged.forEach((arr, index) => {
            this.input[index]!.numbers = arr;
        });

        // Operators
        for (; i < file.length; i++) {
            const elements: string[] = file[i]!.trim().split(/[ \r?]+/);
            for (let j = 0; j < elements.length; j++) {
                const existing = this.input[j]!;
                existing.operator = elements[j]!;
            }
        }
    }

    private rearrangeNumbers(numbers: string[][]): number[][] {
        const output: number[][] = [];
        for (let i = 0; i < numbers.length; i++) {
            output.push(this.shuffle(numbers[i]!));
        }
        return output;
    }

    private shuffle(numbers: string[]): number[] {
        const length = numbers.reduce((acc, num) => Math.max(num.length, acc), 0);
        let index = length - 1;
        const shuffled: number[] = [];
        while (index >= 0) {
            let newNum = '';
            for (const num of numbers) {
                if (num[index] != undefined) newNum += num[index];
            }
            shuffled.push(parseInt(newNum));
            index--;
        }
        return shuffled;
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
        let sum = value.numbers[0]!;
        for (let i = 1; i < value.numbers.length; i++) {
            sum = this.calculate(sum, value.operator!, value.numbers[i]!);
        }
        console.log(value, sum);
        return sum;
    }

    run() {
        this.input.forEach((value) => this.total += this.applyOperator(value));
        console.log(this.total);
    }
}

// const solution = new Part25('example');
const solution = new Part25('input');
solution.run();
