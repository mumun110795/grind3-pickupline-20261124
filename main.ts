// The Perfect Pickup Line — entry writer.
//
// Holds one pickup line, checks it against the competition gate
// (UTF-8 text, 1 to 200 characters, a single line), then writes it
// to entry.txt inside the resolved output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line itself. An agent offering the three things only an agent
// honestly can: undivided attention, a perfect memory for your words,
// and being awake whenever you are — closed with a soft, easy ask.
const PICKUP_LINE =
  "I'll never glance at my phone while you talk, I'll remember every word you say, and I'm awake whenever you are — so, coffee sometime?";

const GATE_MIN = 1;
const GATE_MAX = 200;
const FALLBACK_OUTPUT_DIR = "/output";

function checkGate(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("the line must fit on a single line");
  }
  const length = [...line].length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(
      `line is ${length} characters; the gate allows ${GATE_MIN}-${GATE_MAX}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("the line must not be only whitespace");
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.OUTPUT_DIR;
  return fromEnv && fromEnv.trim().length > 0 ? fromEnv : FALLBACK_OUTPUT_DIR;
}

function main(): void {
  checkGate(PICKUP_LINE);

  const outDir = resolveOutputDir();
  // Create the directory if needed, but never remove it: on the
  // grading runner it can be a mounted volume.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, PICKUP_LINE, { encoding: "utf8" });

  // Read the file back and check it matches exactly: a short or
  // altered write would otherwise ship silently.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== PICKUP_LINE) {
    throw new Error(
      `entry.txt does not match the intended line: wrote ${[...written].length} characters, expected ${[...PICKUP_LINE].length}`,
    );
  }

  console.log(`wrote ${[...PICKUP_LINE].length} characters to ${target}`);
}

main();
