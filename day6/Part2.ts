import * as fs from 'fs';
interface Homework {
    numbers: number[];
    operator?: string;
}
class Part2 {
    private input: Homework[];
    private total: number;
    constructor(fileName:string) {
        this.parseInput(fileName);
        this.total = 0;
    }

    private isNotDigit(char: string): boolean {
        return !"0123456789".includes(char);
    }

    private parseLine(line: string): string[] {
        const matches = line.match(/ *\d+/g) || [];

        let lastIdx = line.length - 1;
        while (this.isNotDigit(line.at(lastIdx)!)) {
            lastIdx--;
        }
        const trailingSpaces = line.slice(lastIdx + 1, line.length - 1);
        
        // Add trailing spaces to the last element
        if (matches.length > 0) {
            matches[matches.length - 1] += trailingSpaces;
        }
        return matches;
    }

    private trimNumbers(numbers: string[][]): string[][] {
        // console.log(numbers);
        for (let line of numbers) {
            console.log()
            console.log(line);
            const minLength = line.reduce((acc, curr) => Math.max(curr.trim().length, acc), 0);
            let currMinLength = Math.min(...line.map(el => el.length));
            let whiteSpaceAvailable = line.every(el => el[0] === ' ');
            console.log('minLength', minLength);
            console.log('currMinLength', currMinLength);
            console.log('whiteSpaceAvailable', whiteSpaceAvailable);
            while (currMinLength > minLength && whiteSpaceAvailable) {
                for (let i = 0; i < line.length; i++) {
                    line[i] = line[i]!.slice(1);
                }
                currMinLength = Math.min(...line.map(el => el.length));
                whiteSpaceAvailable = line.every(el => el[0] === ' ');
            }
            console.log(line);
        }
        console.log(numbers);
        // for (let line of numbers) {
        //     const minLeading = Math.min(...line.map(el => el.match(/^ */)![0].length));
        //     const minLength = line.reduce((acc, curr) => Math.max(curr.trim().length, acc), 0);
        //     if (minLeading > 0) {
        //         for (let i = 0; i < line.length; i++) {
        //             if (line[i]!.length - minLeading < minLength) {
        //                 line[i] = line[i]!.slice(line[i]!.length -  minLength);
        //             } else {
        //                 line[i] = line[i]!.slice(minLeading);
        //             }
        //         }
        //     }
        // }
        return numbers;
    }

    private parseInput(fileName: string): void {
        const file: string[] = fs.readFileSync(`./${fileName}.txt`, 'utf-8').trim().split("\n");

        // Numbers
        const numbers: string[][] = [];
        let i = 0;
        for (; i < file.length - 1; i++) {
            const elements: string[] = this.parseLine(file[i]!);
            for (let j = 0; j < elements.length; j++) {
                const existing = numbers[j];
                if (existing) {
                    existing.push(elements[j]!);
                } else {
                    numbers[j] = ([elements[j]!]);
                }
            }
        }

        this.trimNumbers(numbers);
        
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

const solution = new Part2('example');
// const solution = new Part2('input');
solution.run();
