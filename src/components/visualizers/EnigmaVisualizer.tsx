import React from "react";

const ROTOR_WIRINGS = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",
  "BDFHJLCPRTXVZNYEIWGAKMUSQO",
  "ESOVPZJAYQUIRHXLNFTGKDCMWB",
  "VZBRGITYUPSDNHLXAWMJQOFECK",
] as const;
const ROTOR_NOTCHES = [16, 4, 21, 9, 25] as const;
const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

function buildInverse(wiring: string): number[] {
  const inv = new Array<number>(26).fill(0);
  for (let i = 0; i < 26; i++) {
    inv[wiring.charCodeAt(i) - 65] = i;
  }
  return inv;
}

function stepRotors(pos: number[], notches: readonly number[]): number[] {
  const p = [...pos];
  if (p[1] === notches[1]) {
    p[0] = (p[0] + 1) % 26;
    p[1] = (p[1] + 1) % 26;
  } else if (p[2] === notches[2]) {
    p[1] = (p[1] + 1) % 26;
  }
  p[2] = (p[2] + 1) % 26;
  return p;
}

function encryptChar(
  code: number,
  fwd: number[][],
  bwd: number[][],
  pos: number[],
  ref: number[],
): number {
  let s = code;
  for (let i = 2; i >= 0; i--) {
    s = (fwd[i][(s + pos[i]) % 26] - pos[i] + 26) % 26;
  }
  s = ref[s];
  for (let i = 0; i < 3; i++) {
    s = (bwd[i][(s + pos[i]) % 26] - pos[i] + 26) % 26;
  }
  return s;
}

function parseParams(rotors: string, positions: string) {
  const rNums = rotors
    .trim()
    .split(/[\s,]+/)
    .map((r) => parseInt(r, 10) - 1);
  if (
    rNums.length !== 3 ||
    rNums.some((r) => isNaN(r) || r < 0 || r > 4) ||
    new Set(rNums).size !== 3
  ) {
    throw new Error("Rotor harus 3 angka antara 1–5, contoh: 1 2 3");
  }
  const clean = positions.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length !== 3) {
    throw new Error("Posisi awal harus tepat 3 huruf A–Z, contoh: AAA");
  }
  return {
    rNums,
    initPos: Array.from(clean).map((c) => c.charCodeAt(0) - 65),
  };
}

interface Props {
  rotors: string;
  positions: string;
  text: string;
}

export function EnigmaVisualizer({ rotors, positions, text }: Props) {
  try {
    const { rNums, initPos } = parseParams(rotors, positions);
    const fwd: number[][] = rNums.map((r) =>
      Array.from(ROTOR_WIRINGS[r]).map((c) => c.charCodeAt(0) - 65),
    );
    const bwd: number[][] = rNums.map((r) => buildInverse(ROTOR_WIRINGS[r]));
    const ref = Array.from(REFLECTOR).map((c) => c.charCodeAt(0) - 65);
    const notches = rNums.map((r) => ROTOR_NOTCHES[r]) as number[];

    let pos = [...initPos];
    const steps: Array<{ char: string; posBefore: number[]; out: string }> = [];

    for (const ch of text) {
      if (!/[a-zA-Z]/.test(ch)) {
        steps.push({ char: ch, posBefore: [...pos], out: ch });
        continue;
      }
      pos = stepRotors(pos, notches as readonly number[]);
      const code = ch.toUpperCase().charCodeAt(0) - 65;
      const enc = encryptChar(code, fwd, bwd, pos, ref);
      const out = ch >= "a" ? String.fromCharCode(enc + 97) : String.fromCharCode(enc + 65);
      steps.push({ char: ch, posBefore: [...pos], out });
    }

    return (
      <div style={{ marginTop: 12 }}>
        <h3 style={{ margin: "0 0 8px 0" }}>Visualisasi Enigma — langkah per karakter</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                padding: 8,
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "transparent",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ width: 40, textAlign: "center" }}>{i + 1}</div>
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Input</div>
                <div>{s.char}</div>
              </div>
              <div style={{ minWidth: 220 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Rotor positions (L M R)</div>
                <div>{s.posBefore.map((p) => String.fromCharCode(p + 65)).join(" ")}</div>
              </div>
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Output</div>
                <div style={{ color: "var(--text-accent)" }}>{s.out}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (e) {
    return (
      <div style={{ marginTop: 12 }}>
        <p style={{ color: "var(--error)" }}>{(e as Error).message}</p>
      </div>
    );
  }
}
