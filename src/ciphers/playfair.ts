import type { CipherDefinition } from "../types/cipher";

/**
 * Playfair Cipher — enkripsi digraf menggunakan matriks 5×5.
 * Aturan:
 *  - I dan J diperlakukan sebagai karakter yang sama (J→I)
 *  - Teks dibagi menjadi pasangan huruf (digraf)
 *  - Jika pasangan sama, sisipkan 'X' di antara keduanya
 *  - Jika jumlah huruf ganjil, tambahkan 'X' di akhir
 *  - Hanya huruf alfabet yang diproses
 */
export const playfairCipher: CipherDefinition = {
  id: "playfair",
  name: "Playfair Cipher",
  category: "substitution",
  description:
    "Enkripsi digraf menggunakan matriks 5×5 yang dibentuk dari kata kunci. Huruf I dan J dianggap sama.",
  example: { plaintext: "HELLO", key: "KEY", ciphertext: "DAOETO" },
  params: [
    {
      key: "key",
      label: "Kunci (hanya huruf)",
      type: "text",
      placeholder: "Contoh: KEYWORD",
    },
  ],

  encrypt(plaintext, { key }) {
    const matrix = buildMatrix(key);
    const prepared = prepareText(plaintext);
    const digraphs = makeDigraphs(prepared);
    return digraphs.map((pair) => encryptDigraph(pair, matrix)).join("");
  },

  decrypt(ciphertext, { key }) {
    const matrix = buildMatrix(key);
    // Playfair decrypt hanya menerima teks dengan panjang genap
    const upper = ciphertext
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .replace(/J/g, "I");
    if (upper.length % 2 !== 0) return ciphertext;
    const digraphs: [string, string][] = [];
    for (let i = 0; i < upper.length; i += 2) {
      digraphs.push([upper[i], upper[i + 1]]);
    }
    return digraphs.map((pair) => decryptDigraph(pair, matrix)).join("");
  },
};

/** Bangun matriks 5×5 dari kunci */
function buildMatrix(key: string): string[][] {
  const normalizedKey = key
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  const seen = new Set<string>();
  const sequence: string[] = [];

  for (const char of normalizedKey + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
    if (!seen.has(char)) {
      seen.add(char);
      sequence.push(char);
    }
  }

  const matrix: string[][] = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(sequence.slice(i * 5, i * 5 + 5));
  }
  return matrix;
}

/** Temukan posisi huruf dalam matriks */
function findPosition(char: string, matrix: string[][]): [number, number] {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === char) return [row, col];
    }
  }
  return [0, 0];
}

/** Siapkan teks: hanya huruf, uppercase, J→I */
function prepareText(text: string): string {
  return text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
}

/** Bagi teks menjadi digraf, sisipkan X jika diperlukan */
function makeDigraphs(text: string): [string, string][] {
  const digraphs: [string, string][] = [];
  let i = 0;
  while (i < text.length) {
    const a = text[i];
    let b = text[i + 1] ?? "X";
    if (a === b) {
      b = "X";
      i++;
    } else {
      i += 2;
    }
    digraphs.push([a, b]);
  }
  return digraphs;
}

/** Enkripsi satu digraf */
function encryptDigraph([a, b]: [string, string], matrix: string[][]): string {
  const [ra, ca] = findPosition(a, matrix);
  const [rb, cb] = findPosition(b, matrix);

  if (ra === rb) {
    // Baris sama: geser kolom ke kanan
    return matrix[ra][(ca + 1) % 5] + matrix[rb][(cb + 1) % 5];
  } else if (ca === cb) {
    // Kolom sama: geser baris ke bawah
    return matrix[(ra + 1) % 5][ca] + matrix[(rb + 1) % 5][cb];
  } else {
    // Persegi: tukar kolom
    return matrix[ra][cb] + matrix[rb][ca];
  }
}

/** Dekripsi satu digraf */
function decryptDigraph([a, b]: [string, string], matrix: string[][]): string {
  const [ra, ca] = findPosition(a, matrix);
  const [rb, cb] = findPosition(b, matrix);

  if (ra === rb) {
    return matrix[ra][(ca + 4) % 5] + matrix[rb][(cb + 4) % 5];
  } else if (ca === cb) {
    return matrix[(ra + 4) % 5][ca] + matrix[(rb + 4) % 5][cb];
  } else {
    return matrix[ra][cb] + matrix[rb][ca];
  }
}
