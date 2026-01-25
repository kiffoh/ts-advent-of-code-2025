import * as fs from 'fs';
interface Homework {
    numbers: number[];
    operator?: string;
}
class Part22 {
    private input: Homework[];
    private total: number;
    private amountOfNumbers: number;
    constructor(fileName:string) {
        this.parseInput(fileName);
        this.total = 0;
    }

    private isNotDigit(char: string): boolean {
        return !"0123456789".includes(char);
    }

    private parseLine(line: string): string[] {
        const matches = line.replace("\r","").split(/(\d+)/g) || [];
        const max = matches.length - 1;
        const trimmed = matches.map((el, idx) =>  (
            (idx > 0 && idx < max && idx % 2 == 0) ? el.slice(1) : el
        ))
        this.amountOfNumbers = trimmed.filter((el) => "0123456789".includes(el[0]!)).length;
        return trimmed;
    }
    
    private range(start: number, stop: number, step: number = 1): number[] {
        const result: number[] = [];
        for (let i = start; i < stop; i += step) {
            result.push(i);
        }
        return result;
    }

    private trimNumbers(numbers: string[][]): string[][] {
        const indxs = this.range(2, numbers[0]!.length, 2);
        for (let arr of numbers) {
            indxs.forEach((idx) => arr[idx]!.slice(1));
        }
        console.log("trimNumbers:",numbers);
        return [];
    }

    private getMaxLengths(numbers: string[][]): number[] {
        const maxes: number[] = Array(this.amountOfNumbers).fill(0);
        const nums = "0123456789";
        for (const arr of numbers) {
            let maxIndx = 0;
            for (const element of arr) {
                if (nums.includes(element[0]!)) {
                    maxes[maxIndx] = Math.max(maxes[maxIndx]!, element.length);
                    maxIndx++;
                }
            }
        }
        return maxes;
    }

    private sort(curr: string[][], maxes: number[]): string[][] {
        const output: string[][] = [];
        for (const array of curr) {
            let index = 0;
            for (let j = 1; j < array.length; j+=2) {
                let num = array[j]!;
                if (num.length < maxes[index]!) {
                    const prevGaps = array[j-1];
                    if (prevGaps!.length > 0) {
                        num = prevGaps + num;
                        // console.log("Accurate gaps added: ", num.length === maxes[index]!);
                    } else {
                        num += array[j+1];
                        // console.log("Accurate gaps added: ", num.length === maxes[index]!);
                    }
                }

                const existing = output[index];
                if (existing) {
                    existing.push(num);
                } else {
                    output[index] = ([num]);
                }
                index++;
            }
        }
        return output;
    }

    private parseInput(fileName: string): void {
        const file: string[] = fs.readFileSync(`./${fileName}.txt`, 'utf-8').trim().split("\n");

        // Numbers
        const numbers: string[][] = [];
        let i = 0;
        for (; i < file.length - 1; i++) {
            const elements: string[] = this.parseLine(file[i]!);
            elements[elements.length - 2] += elements.pop()!;
            numbers.push(elements);
        }
        const maxes = this.getMaxLengths(numbers);

        const sorted = this.sort(numbers, maxes);

        
        const rearranged: number[][] = this.rearrangeNumbers(sorted);
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

// const solution = new Part22('example');
const solution = new Part22('input');
solution.run();
