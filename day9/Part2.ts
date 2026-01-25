import * as fs from 'fs';
class Point {
    constructor(
        public x: number,
        public y: number
    ) {}

    key(): string {
        return `${this.x},${this.y}`;
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

class Part2 {
    redTiles: Point[];
    validTiles: Map<string, Point>;
    maxArea: number;

    constructor(fileName: string) {
        this.redTiles = this.parseInput(fileName);
        this.validTiles = new Map();
        this.maxArea = 0;
    }



    private getConnectingTiles(p1: Point, p2: Point): Point[] {
        const connecting = [];
        const sameRow = p1.x === p2.x;
        if (sameRow) {
            const lower = Math.min(p1.x, p2.x) === p1.x ? p1 : p2;
            const higher = lower.equals(p1) ? p2 : p1;
            const constY = p1.y;
            for (let x = lower.x + 1; x < higher.x; x++) {
                connecting.push(new Point(x, constY));
            }
        } else { // sameCol
            const lower = Math.min(p1.y, p2.y) === p1.y ? p1 : p2;
            const higher = lower.equals(p1) ? p2 : p1;
            const constX = p1.x;
            for (let y = lower.y + 1; y < higher.y; y++) {
                connecting.push(new Point(constX, y));
            }
        }
        return connecting;
    }

    private getPerimeterTiles() {
        let last = null;
        for (const tile of this.redTiles) {
            this.validTiles.set(tile.key(), tile);
            if (!last) {
                last = tile;
                continue
            };
            this.getConnectingTiles(last, tile).forEach((tile: Point) => this.validTiles.set(tile.key(), tile));
            last = tile;
        }
        if (!last) throw new Error("Last is null");
        const starting = this.redTiles[0]!
        this.getConnectingTiles(last, starting).forEach((tile: Point) => this.validTiles.set(tile.key(), tile));
    }

    private findInnerTile(): Point {
        const maxX = Math.max(...this.redTiles.map(tile => tile.x));
        const maxY = Math.max(...this.redTiles.map(tile => tile.y));
        let inner = null;
        outer:
        for (let y = 0; y < maxY; y++) {
            for (let x = 0; x < maxX; x++) {
                if (this.validTiles.has(new Point(x, y).key())) {
                    inner = new Point(x + 1, y + 1);
                    break outer;
                }
            }
        }
        if (!inner) throw new Error("Inner not found");
        return inner;
    }

    private getInnerTiles() {
        const queue: Point[] = [this.findInnerTile()];
        const DIRECTIONS = [
            new Point(-1, 0),
            new Point(1, 0),
            new Point(0, -1),
            new Point(0, 1),
        ]
        while (queue.length !== 0) {
            const curr = queue.shift()!;
            for (const direction of DIRECTIONS) {
                const insideTile = new Point(curr.x + direction.x, curr.y + direction.y);
                if (!this.validTiles.has(insideTile.key())) {
                    queue.push(insideTile);
                    this.validTiles.set(insideTile.key(), insideTile);
                }
            }
            this.validTiles.set(curr.key(), curr);
        }
    }

    private parseInput(fileName: string): Point[] {
        const page = fs.readFileSync(`${fileName}.txt`, 'utf-8').trim().split(/\r\n/);
        const stringTuples = page.map(str => str.trim().split(",")) as [string, string][];
        return stringTuples.map((tuple) => new Point(parseInt(tuple[0]), parseInt(tuple[1])));
    }

    private calculateAreas() {
        const areas = [];
        for (let i = 0; i < this.redTiles.length; i++) {
            const p1: Point = this.redTiles[i]!;
            for (let j = i + 1; j < this.redTiles.length; j++) {
                const p2: Point = this.redTiles[j]!;
                const areaTiles = this.getAreaTiles(p1, p2);
                const area = Math.abs(p1.x - p2.x + 1) * Math.abs(p1.y - p2.y + 1);
                if (this.areaValid(areaTiles)) areas.push(area);
            }
        }
        this.maxArea = Math.max(...areas);
    }
    
    private areaValid(points: Point[]): boolean {
        for (const p of points) {
            if (!this.validTiles.has(p.key())) return false;
        }
        return true;
    }

    private getAreaTiles(p1: Point, p2: Point): Point[] {
        const tiles: Point[] = [];
        const lowerX = Math.min(p1.x, p2.x);
        const higherX = Math.max(p1.x, p2.x);
        const lowerY = Math.min(p1.y, p2.y);
        const higherY = Math.max(p1.y, p2.y);
        for (let y = lowerY; y <= higherY; y++) {
            for (let x = lowerX; x <= higherX; x++) {
                tiles.push(new Point(x, y));
            }
        }
        return tiles;
    }

    run() {
        this.getPerimeterTiles();
        this.getInnerTiles();
        this.calculateAreas();
        console.log(this.maxArea);
    }
}

const solution = new Part2('example');
// const solution = new Part2('input');
solution.run();

