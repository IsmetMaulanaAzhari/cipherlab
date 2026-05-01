import type { CipherDefinition } from "../types/cipher";

/**
 * Rail Fence Cipher — transposisi zigzag.
 * Teks ditulis dalam pola zigzag melintasi sejumlah "rel" (baris),
 * lalu dibaca baris per baris untuk menghasilkan ciphertext.
 * Hanya memproses seluruh teks (termasuk spasi) dalam pola zigzag.
 */
export const railFenceCipher: CipherDefinition = {
  id: "railfence",
  name: "Rail Fence",
  category: "transposition",
  description:
    "Transposisi zigzag: teks ditulis berkelok-kelok di sejumlah rel, lalu dibaca per baris.",
  example: {
    plaintext: "HELLO WORLD",
    key: "rails: 3",
    ciphertext: "HOLELWRDLO ",
  },
  params: [
    {
      key: "rails",
      label: "Jumlah Rel (2–10)",
      type: "number",
      placeholder: "Contoh: 3",
      min: 2,
      max: 10,
    },
  ],
  encrypt(plaintext, { rails }) {
    const numRails = parseInt(rails, 10);
    if (numRails <= 1 || numRails >= plaintext.length) return plaintext;

    // Buat array untuk setiap rel
    const fence: string[][] = Array.from({ length: numRails }, () => []);
    let rail = 0;
    let direction = 1; // 1 = turun, -1 = naik

    for (const char of plaintext) {
      fence[rail].push(char);
      if (rail === 0) direction = 1;
      else if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    return fence.map((r) => r.join("")).join("");
  },
  decrypt(ciphertext, { rails }) {
    const numRails = parseInt(rails, 10);
    if (numRails <= 1 || numRails >= ciphertext.length) return ciphertext;

    const len = ciphertext.length;
    // Tentukan pola zigzag
    const pattern: number[] = new Array(len);
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < len; i++) {
      pattern[i] = rail;
      if (rail === 0) direction = 1;
      else if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    // Hitung panjang setiap rel
    const railLengths: number[] = new Array(numRails).fill(0);
    for (const r of pattern) railLengths[r]++;

    // Pecah ciphertext ke masing-masing rel
    const fenceRows: string[] = [];
    let pos = 0;
    for (const rowLen of railLengths) {
      fenceRows.push(ciphertext.slice(pos, pos + rowLen));
      pos += rowLen;
    }

    // Rekonstruksi plaintext sesuai pola
    const railIndices: number[] = new Array(numRails).fill(0);
    let result = "";
    for (const r of pattern) {
      result += fenceRows[r][railIndices[r]++];
    }

    return result;
  },
};
