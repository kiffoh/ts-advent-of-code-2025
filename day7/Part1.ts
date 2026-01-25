import * as fs from 'fs';
import { queryObjects } from 'v8';

interface Point {
    x: number,
    y: number
}

class Queue<T> {
    private items: T[] = [];

    add(item: T) {
        this.items.push(item);
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    poll(): T {
        if (this.isEmpty()) throw new Error('Empty queue');
        return this.items[0]!;
    }

    dequeue(): T {
        if (this.isEmpty()) throw new Error('Empty queue');
        return this.items.shift()!;
    }
}

class Part1 {
    private totalSplits: number;
    private input: string[];
    private start: Point;
    private maxX: number;
    private maxY: number;
    private found: Set<string>;

    constructor(fileName: string) {
        this.totalSplits = 0;
        this.input = this.parseFile(fileName);
        this.maxX = this.input[0]!.length;
        this.maxY = this.input.length;
        this.start = this.getStartCoords();
        this.found = new Set();
    }

    private parseFile(fileName: string): string[] {
        return fs.readFileSync(`${fileName}.txt`, 'utf-8').trim().split(/\r\n/);
    }

    private getStartCoords(): Point {
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                if (this.input[y]![x] === 'S') return {x,y};
            }
        }
        throw new Error("Input does not contain a valid starting point");
    }

    private simulate() {
        const queue: Queue<Point> = new Queue();
        queue.add(this.start);

        while (!queue.isEmpty()) {
            const curr = queue.dequeue();
            const next = {x: curr.x, y: curr.y + 1 };

            // Out of bounds
            if (next.y === this.maxY || next.x < 0 || next.x === this.maxX) continue;
            
            const key = `${next.x},${next.y}`;
            if (this.input[next.y]![next.x] === "^" && !this.found.has(key)) {
                this.found.add(key);
                // Split occurrence
                const left: Point = {...next};
                left.x -= 1;
                const right: Point = {...next};
                right.x += 1;
                queue.add(left);
                queue.add(right);
                this.totalSplits++;
            } else if (this.input[next.y]![next.x] === ".") {
               queue.add(next);
            }
        }
    }

    run() {
        this.simulate();
        console.log(this.totalSplits);
    }
}

// const solution = new Part1('example');
const solution = new Part1('input');
solution.run();
