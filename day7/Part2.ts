import * as fs from 'fs';

interface Point {
    x: number,
    y: number
}

class PriorityQueue<T> {
    private items: T[] = [];

    constructor(private compare: (a: T, b: T) => number) {}

    add(item: T) {
        let i = 0;
        while (i < this.items.length && this.compare(this.items[i]!, item) <= 0) {
            i++;
        }
        this.items.splice(i, 0, item);
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

class Journey {
    public x: number;
    public y: number;
    private path: string[][];
    private currentTimeline: string[];

    constructor(x: number, y: number, path: string[][], currentTimeline: string[]) {
        this.x = x;
        this.y = y;
        this.path = path;
        this.currentTimeline = currentTimeline;
    }

    static fromPoint(p: Point): Journey {
        return new Journey(
            p.x,
            p.y,
            [],
            []
        );
    }

    static fromJourney(j: Journey): Journey {
        j.addTimelineToPath();
        return new Journey(
            j.x,
            j.y,
            [...j.path],
            []
        );
    }

    addTimelineToPath() {
        this.path.push(this.currentTimeline);
    }

    addToTimeline(p: Point) {
        this.currentTimeline.push(`${p.x},${p.y}`);
    }

    getPath(): string[] {
        return this.path.flatMap((arr) => arr);
    }
}

class Part2 {
    private input: string[];
    private start: Point;
    private maxX: number;
    private maxY: number;
    private timelines: Set<string>;

    constructor(fileName: string) {
        this.input = this.parseFile(fileName);
        this.maxX = this.input[0]!.length;
        this.maxY = this.input.length;
        this.start = this.getStartCoords();
        this.timelines = new Set();
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

    private addToTimeline(path: string[]): void {
        const timeline = path.reduce((prev, curr) => prev + curr, "");
        this.timelines.add(timeline);
    }

    private simulate() {
        const queue: PriorityQueue<Journey> = new PriorityQueue((j1, j2) => j1.);
        queue.add(Journey.fromPoint(this.start));

        while (!queue.isEmpty()) {
            const curr = queue.dequeue();
            console.log(`${curr.x},${curr.y}`)
            const next = {x: curr.x, y: curr.y + 1 };

            // Out of bounds
            if (next.x < 0 || next.x === this.maxX) continue;
            // Reached end
            if (next.y === this.maxY) {
                curr.addToPath(next);
                this.addToTimeline(curr.getPath());
                continue;
            }
            
            if (this.input[next.y]![next.x] === "^") {
                // Split occurrence
                const left: Journey = Journey.fromJourney(curr);
                left.x -= 1;
                const right: Journey = Journey.fromJourney(curr);
                right.x += 1;
                queue.add(left);
                queue.add(right);
            } else if (this.input[next.y]![next.x] === ".") {
                curr.addToPath(curr);
                curr.x = next.x;
                curr.y = next.y;
                queue.add(curr);
            }
        }
    }

    run() {
        this.simulate();
        // console.log(this.timelines);
        console.log(this.timelines.size);
    }
}

// const solution = new Part2('example');
const solution = new Part2('input');
solution.run();
