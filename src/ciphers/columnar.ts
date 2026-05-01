import type { CipherDefinition } from "../types/cipher";

/**
 * Tentukan urutan baca kolom berdasarkan pengurutan alfabetis karakter kunci.
 * Mengembalikan array indeks kolom dari urutan huruf terkecil ke terbesar.
 *
 * Contoh: key="KEY" → K(0), E(1), Y(2)
 * Sort alphabetically: E(1) < K(0) < Y(2) → order = [1, 0, 2]
 */
function getColumnOrder(key: string): number[] {
  return key
    .split("")
    .map((char, i) => ({ char, i }))
    .sort((a, b) => a.char.localeCompare(b.char))
    .map((item) => item.i);
}

/**
 * Columnar Transposition Cipher — plaintext ditulis dalam baris-baris
 * selebar kunci (kolom = panjang kunci), kemudian kolom dibaca sesuai
 * urutan alfabetis karakter kunci.
 *
 * Enkripsi:
 *   1. Buang non-huruf, ubah ke uppercase
 *   2. Pad dengan 'X' hingga kelipatan panjang kunci
 *   3. Tulis dalam tabel numRows × numCols
 *   4. Baca kolom sesuai urutan alfabetis kunci
 *
 * Dekripsi:
 *   1. Tentukan dimensi tabel yang sama
 *   2. Isi kembali kolom sesuai urutan enkripsi
 *   3. Baca baris per baris untuk mendapatkan plaintext
 *
 * Terverifikasi: "HELLO" + key "KEY" → "EOHLLX"
 *   Tabel (2 baris × 3 kolom):  H E L
 *                                L O X
 *   Urutan baca: E(col1)→"EO", K(col0)→"HL", Y(col2)→"LX" → "EOHLLX"
 */
export const columnarCipher: CipherDefinition = {
  id: "columnar",
  name: "Cipher Transposisi Kolom",
  category: "transposition",
  description:
    "Teks ditulis dalam baris-baris selebar kunci, lalu kolom dibaca sesuai urutan alfabetis kunci. Tidak ada substitusi — hanya posisi karakter yang berubah.",
  example: { plaintext: "HELLO", key: "KEY", ciphertext: "EOHLLX" },
  params: [
    {
      key: "key",
      label: "Kunci Transposisi (huruf saja)",
      type: "text",
      placeholder: "Contoh: KEY",
    },
  ],
  encrypt(plaintext, { key }) {
    const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
    if (normalizedKey.length === 0) {
      throw new Error("Kunci tidak boleh kosong dan harus mengandung huruf.");
    }

    // Ambil hanya huruf, ubah ke uppercase
    const letters = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    if (letters.length === 0) return "";

    const numCols = normalizedKey.length;
    const numRows = Math.ceil(letters.length / numCols);
    const paddedLen = numRows * numCols;

    // Pad dengan 'X' agar tabel penuh
    const padded = letters.padEnd(paddedLen, "X");

    // Tentukan urutan kolom berdasarkan pengurutan alfabetis kunci
    const order = getColumnOrder(normalizedKey);

    // Baca kolom sesuai urutan alfabetis
    let result = "";
    for (const col of order) {
      for (let row = 0; row < numRows; row++) {
        result += padded[row * numCols + col];
      }
    }
    return result;
  },
  decrypt(ciphertext, { key }) {
    const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
    if (normalizedKey.length === 0) {
      throw new Error("Kunci tidak boleh kosong dan harus mengandung huruf.");
    }

    // Ambil hanya huruf dari ciphertext
    const letters = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
    if (letters.length === 0) return "";

    const numCols = normalizedKey.length;
    const numRows = Math.ceil(letters.length / numCols);

    // Validasi: panjang ciphertext harus kelipatan numCols
    if (letters.length % numCols !== 0) {
      throw new Error(
        `Panjang ciphertext (${letters.length}) harus kelipatan panjang kunci (${numCols}).`,
      );
    }

    // Tentukan urutan kolom yang sama dengan saat enkripsi
    const order = getColumnOrder(normalizedKey);

    // Isi kembali setiap kolom sesuai urutan baca enkripsi
    const columns: string[] = new Array(numCols).fill("");
    let pos = 0;
    for (const col of order) {
      columns[col] = letters.slice(pos, pos + numRows);
      pos += numRows;
    }

    // Baca tabel baris per baris untuk mendapatkan plaintext
    let result = "";
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        result += columns[col][row];
      }
    }
    return result;
  },
};
