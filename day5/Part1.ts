import * as fs from 'fs';

class Part1 {
    private ranges: string[];
    private availableIngredientIds: string[];
    private freshIngredientIds: [number, number][];
    private total;

    constructor(fileName: string) {
        [this.ranges, this.availableIngredientIds] = this.parseInput(fileName);
        this.freshIngredientIds = [];
        this.total = 0;
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

    private populateFreshIds() {
        for (const range of this.ranges) {
            const parts = range.split("-").map(str => parseInt(str));
            const lower = parts[0];
            const higher = parts[1];
            
            if (lower === undefined || higher === undefined || isNaN(lower) || isNaN(higher)) {
                throw Error('Not a valid ID');
            }

            this.freshIngredientIds.push([lower, higher]);
        }
    }

    private determineFreshIngredients() {
        this.availableIngredientIds.forEach(id => {
            const num = parseInt(id);
            for (const [lower, higher] of this.freshIngredientIds) {
                if (lower <= num && num <= higher) {
                    this.total++;
                    break;
                }
            }
        })
    }

    public run() {
        this.populateFreshIds();
        this.determineFreshIngredients();
        return this.total;
    }
}

// const solution = new Part1('exampleInput');
const solution = new Part1('input');
console.log(solution.run());

