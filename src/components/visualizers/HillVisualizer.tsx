import React from "react";

function buildKeyMatrix(key: string): number[][] {
  const letters = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (letters.length < 4) {
    throw new Error("Kunci harus mengandung minimal 4 huruf.");
  }
  const k = Array.from(letters.slice(0, 4)).map((c) => c.charCodeAt(0) - 65);
  return [
    [k[0], k[1]],
    [k[2], k[3]],
  ];
}

function matMulVec(mat: number[][], vec: number[]): number[] {
  return [
    ((mat[0][0] * vec[0] + mat[0][1] * vec[1]) % 26 + 26) % 26,
    ((mat[1][0] * vec[0] + mat[1][1] * vec[1]) % 26 + 26) % 26,
  ];
}

interface Props {
  keyText: string;
  text: string;
}

export function HillVisualizer({ keyText, text }: Props) {
  try {
    const mat = buildKeyMatrix(keyText);
    const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
    const padded = letters.length % 2 === 0 ? letters : letters + "X";

    const rows: Array<{
      pair: string;
      vec: number[];
      enc: number[];
    }> = [];

    for (let i = 0; i < padded.length; i += 2) {
      const pair = padded.slice(i, i + 2);
      const vec = [pair.charCodeAt(0) - 65, pair.charCodeAt(1) - 65];
      const enc = matMulVec(mat, vec);
      rows.push({ pair, vec, enc });
    }

    return (
      <div style={{ marginTop: 12 }}>
        <h3 style={{ margin: "0 0 8px 0" }}>Visualisasi Hill — langkah per digraf</h3>
        <div style={{ padding: 8, border: "1px solid var(--border)", borderRadius: 6 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Key matrix (2×2)</div>
            <div>
              [{mat[0][0]}, {mat[0][1]}]
              <br />[{mat[1][0]}, {mat[1][1]}]
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Pair</div>
                  <div>{r.pair}</div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Vector</div>
                  <div>[{r.vec[0]}, {r.vec[1]}]</div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Result (mod 26)</div>
                  <div style={{ color: "var(--text-accent)" }}>[{r.enc[0]}, {r.enc[1]}] → {String.fromCharCode(r.enc[0]+65)}{String.fromCharCode(r.enc[1]+65)}</div>
                </div>
              </div>
            ))}
          </div>
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
