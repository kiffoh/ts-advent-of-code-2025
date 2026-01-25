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

class Part2 {
    private input: string[];
    private start: Point;
    private maxX: number;
    private maxY: number;
    public timelines: Map<string, number>;

    constructor(fileName: string) {
        this.input = this.parseFile(fileName);
        this.maxX = this.input[0]!.length;
        this.maxY = this.input.length;
        this.start = this.getStartCoords();
        this.timelines = new Map();
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

    private simulate(starting: Point): number {
        const queue: Queue<Point> = new Queue();
        queue.add(starting);
        let totalJourneys = 0;

        while (!queue.isEmpty()) {
            const curr = queue.dequeue();
            const next = {x: curr.x, y: curr.y + 1 };

            // Out of bounds
            if (next.x < 0 || next.x === this.maxX) continue;
            if (next.y === this.maxY) {
                totalJourneys++;
                continue;
            }
            
            const key = `${next.x},${next.y}`;
            if (this.input[next.y]![next.x] === "^") {
                if (this.timelines.has(key)) {
                    totalJourneys += this.timelines.get(key)!;
                    continue;
                } 
                throw new Error(`Splitter at ${key} not yet processed - logic error`);
            } else if (this.input[next.y]![next.x] === ".") {
               queue.add(next);
            }
        }
        return totalJourneys;
    }

    // Is backtrack the correct term?
    // DP - Bottom up
    private populateTimelines() {
        for (let y = this.input.length - 1; y >= 0; y--) {
            const line = this.input[y]!;
            for (let x = 0; x < this.input[0]!.length; x++) {
                if (line[x] === "^") {
                    const numberOfTimelines: number = this.simulate({x: x - 1, y}) + this.simulate({x: x + 1, y});
                    this.timelines.set(`${x},${y}`, numberOfTimelines);
                }
            }
        }
        console.log(this.timelines);
    }

    run() {
        this.populateTimelines();
        const totalTimelines = this.simulate(this.start);
        console.log(totalTimelines);
    }
}

// const solution = new Part2('example');
const solution = new Part2('input');
solution.run();
