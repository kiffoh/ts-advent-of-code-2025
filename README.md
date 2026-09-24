# Advent of Code 2025 (TypeScript)

My solutions to [Advent of Code 2025](https://adventofcode.com/2025), written in TypeScript and run directly with `tsx` (no build step).

## Status

In progress. Days 2 to 9 are present, each with a solution for part 1 and part 2.

| Day | Part 1 | Part 2 |
|-----|--------|--------|
| 2   | yes    | yes    |
| 3   | yes    | yes    |
| 4   | yes    | yes    |
| 5   | yes    | yes    |
| 6   | yes    | yes    |
| 7   | yes    | yes    |
| 8   | yes    | yes    |
| 9   | yes    | yes    |

Days 6 and 7 also contain extra files (`Part22.ts`, `Part25.ts` in day6; `Part22.ts` in day7) from earlier attempts at part 2, kept alongside the final version.

Day 1 is not yet started.

## Running a solution

Each day is a self-contained folder with its own `Part1.ts` and `Part2.ts`. Install dependencies once from the repo root, then run a file with `tsx` from inside that day's folder (input paths are relative to the current directory):

```bash
npm install
cd day2
npx tsx part1.ts
npx tsx part2.ts
```

Most files also have a commented-out line to switch between running against `example.txt` (or `exampleInput.txt`) and the real `input.txt`.

## Puzzle inputs

Puzzle inputs aren't included, since Advent of Code asks people not to share them. Save yours as `input.txt` in the day's folder before running a solution.
