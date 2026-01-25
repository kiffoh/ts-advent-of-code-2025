import * as fs from 'fs';

class JunctionBox {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}
}

class Relationship {
    public euclideanDistance: number;
    public key1: string;
    public key2: string;

    constructor(
        box1: JunctionBox,
        box2: JunctionBox
    ) {
        this.key1 = this.getKey(box1);
        this.key2 = this.getKey(box2);
        this.euclideanDistance = this.getDistance(box1, box2);
    }

    getKey(box: JunctionBox): string {
        return `${box.x},${box.y},${box.z}`;
    }

    getDistance(box1: JunctionBox, box2: JunctionBox): number {
        return Math.sqrt((box1.x - box2.x) ** 2 + (box1.y - box2.y) ** 2 + (box1.z - box2.z) ** 2);
    }
}

class Part2 {
    private boxes: JunctionBox[];
    private relationships: Relationship[];
    private connections: Set<string>[];
    private result: number;

    constructor(public fileName: string) {
        this.boxes = this.parseInput(fileName);
        this.relationships = this.getRelationships();
        this.connections = [];
        this.result = 0;
    }  

    private parseInput(fileName: string): JunctionBox[] {
        const output = [];
        const file = fs.readFileSync(`${fileName}.txt`, 'ascii').trim().split(/\n/);
        for (const line of file) {
            const parts = line.trim().split(",");
            if (parts.length !== 3) throw new Error('Invalid input');
            output.push(new JunctionBox(parseInt(parts[0]!), parseInt(parts[1]!), parseInt(parts[2]!)))
        }
        console.log("Boxes assigned");
        return output;
    }

    private getRelationships(): Relationship[] {
        const randomRelationships: Relationship[] = [];
        for (let i = 0; i < this.boxes.length - 1; i++) {
            const box1 = this.boxes[i]!;
            for (let j = i + 1; j < this.boxes.length; j++) {
                const box2 = this.boxes[j]!;
                const relationship = new Relationship(box1, box2);
                randomRelationships.push(relationship);
            }
        }
        randomRelationships.sort((a, b) => a.euclideanDistance - b.euclideanDistance);
        console.log("Relationships assigned");
        return randomRelationships;
    }

    private getCurrentSets(key1:string, key2:string) {
        const sets = [];
        for (const set of this.connections) {
            if (set.has(key1) || set.has(key2)) sets.push(set);
        }
        if (sets.length > 2) throw new Error("Incorrect logic for sets");
        return sets;
    }

    private setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
        if (a.size !== b.size) return false;
        for (const val of a) {
            if (!b.has(val)) return false;
        }
        return true;
    }

    private connectBoxes(): Relationship {
        let last = null;
        const numberOfBoxes = this.boxes.length;
        for (const relationship of this.relationships) {
            if (this.connections.length === 1 && this.connections[0]!.size === numberOfBoxes) break;
            const existing =  this.getCurrentSets(relationship.key1, relationship.key2);
            if (existing.length === 0) {
                const newSet = new Set<string>();
                newSet.add(relationship.key1);
                newSet.add(relationship.key2);
                this.connections.push(newSet);
            } else if (existing.length === 1) {
                existing[0]!.add(relationship.key1);
                existing[0]!.add(relationship.key2);
            } else { // 2 sets
                existing[1]!.forEach(el => existing[0]!.add(el));
                this.connections = this.connections.filter(set => !this.setsEqual(set, existing[1]!));
            }
            last = relationship;
        }
        if (!last) throw new Error("Last is null")
        return last;
    }

    private calculateResult(last: Relationship) {
        const x1 = last.key1.split(",")[0];
        const x2 = last.key2.split(",")[0];
        this.result = parseInt(x1!) * parseInt(x2!);
    }

    run() {
        const last = this.connectBoxes();
        this.calculateResult(last)
        // console.log(this.connections);
        console.log(this.result);
    }
}

// const solution = new Part2("example");
const solution = new Part2("input");
solution.run();
