import * as fs from 'fs';

class Part2 {
    private ranges: string[];
    private availableIngredientIds: string[];
    private freshIngredientIds: [number, number][];
    private total;
    private refinedRanges: [number, number][];

    constructor(fileName: string) {
        [this.ranges, this.availableIngredientIds] = this.parseInput(fileName);
        this.freshIngredientIds = [];
        this.total = 0;
        this.refinedRanges = []; 
    }

    private parseInput(fileName: string): [string[], string[]] {
        const raw = fs.readFileSync(`${fileName}.txt`, 'ascii');
        
        const blocks = raw
            .trim()
            .split(/\r?\n\r?\n/)
            .map(block => block
                .split(/\r?\n/)
                .map(line => line.trim())
            );


        if (blocks.length !== 2) throw Error('Invalid input format: expected two blocks separated by a blank line');

        return [blocks[0]!, blocks[1]!];
    }

    private parseRange(range:String): [number, number] {
        const parts = range.split("-").map(str => parseInt(str));
        const lower = parts[0];
        const higher = parts[1];
        
        if (lower === undefined || higher === undefined || isNaN(lower) || isNaN(higher)) {
            throw Error('Not a valid ID');
        }
        return [lower, higher];
    }

    private isolatedRange([lower, higher]: [number, number]): boolean {
        for (let i=0; i < this.refinedRanges.length; i++) {
            const [currLower, currHigher] = this.refinedRanges[i]!;
            if (i === 0) {
                if (higher < currLower) {
                    this.refinedRanges.splice(0, 0, [lower, higher])
                    return true;
                }
            }
            if (i === this.refinedRanges.length - 1) {
                if (currHigher < lower) {
                    this.refinedRanges.push([lower, higher]);
                    return true;
                }
                return false;
            }

            const [nextLower, nextHigher] = this.refinedRanges[i + 1]!;
            if (currHigher < lower && higher < nextLower) {
                this.refinedRanges.splice(i + 1, 0, [lower, higher]);
                return true;
            }
        }
        return false;
    }

    private getOverlappingRanges([lower, higher]: [number, number]): Map<number, [number, number]> {
        const overlaps = new Map<number, [number, number]>();
        overlaps.set(-1, [lower, higher]);

        for (let i = 0; i < this.refinedRanges.length; i++) {
            const [refinedLower, refinedHigher] = this.refinedRanges[i]!;

            // Check if ranges overlap in ANY way:
            // 1. New range's lower bound is within existing range
            const lowerOverlaps = refinedLower <= lower && lower <= refinedHigher;
            // 2. New range's upper bound is within existing range
            const higherOverlaps = refinedLower <= higher && higher <= refinedHigher;
            // 3. New range completely encompasses existing range
            const encompassesExisting = lower <= refinedLower && refinedHigher <= higher;

            if (lowerOverlaps || higherOverlaps || encompassesExisting) overlaps.set(i, [refinedLower, refinedHigher]);
        }
        return overlaps;
    }

    private mergeOverlapping([lower, higher]: [number, number]) {
        const overlaps: Map<number, [number, number]> = this.getOverlappingRanges([lower, higher]);

        const indexes = overlaps.keys().filter(val => val !== -1).toArray();
        const startingIndex = Math.min(...indexes);
        const deleteCount = indexes.length;

        const allValues = overlaps.values().flatMap(arr => arr).toArray().sort((a,b) => a - b);

        // console.log(startingIndex, ",", deleteCount,",", "[",allValues[0]!, ",",allValues[allValues.length - 1]!,"]");
        this.refinedRanges.splice(startingIndex, deleteCount, [allValues[0]!, allValues[allValues.length - 1]!])
    }

    private refineRanges() {
        for (const range of this.ranges) {
            const [lower, higher] = this.parseRange(range);

            if (this.refinedRanges.length === 0) {
                this.refinedRanges.push([lower, higher]);
                continue;
            }

            if (this.isolatedRange([lower, higher])) continue;

            this.mergeOverlapping([lower, higher]);
        }
    }

    private getTotalFreshIds() {
        for (const [lower, higher] of this.refinedRanges) {
            this.total += (higher - lower + 1);
        }
    }

    public run() {
        this.refineRanges();
        // console.log(this.refinedRanges);
        this.getTotalFreshIds();
        return this.total;
    }
}

// const solution = new Part2('exampleInput');
const solution = new Part2('input');
console.log(solution.run());

// 439955833896392 - too high
// 433069657831478 - too high
// 401400463866627 - too high
