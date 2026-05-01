import type { CipherDefinition } from "../types/cipher";

/**
 * Tabel homopon: setiap huruf A-Z dipetakan ke satu atau lebih kode numerik (00-99).
 * Huruf dengan frekuensi tinggi dalam bahasa Inggris mendapat lebih banyak kode
 * untuk menyamarkan analisis frekuensi pada ciphertext.
 * Total: 100 kode (00–99), masing-masing unik.
 */
const HOMOPHONES: Record<string, number[]> = {
  E: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],   // 13 kode (frekuensi tertinggi ~13%)
  T: [13, 14, 15, 16, 17, 18, 19, 20, 21],           //  9 kode
  A: [22, 23, 24, 25, 26, 27, 28, 29],               //  8 kode
  O: [30, 31, 32, 33, 34, 35, 36, 37],               //  8 kode
  I: [38, 39, 40, 41, 42, 43, 44],                   //  7 kode
  N: [45, 46, 47, 48, 49, 50, 51],                   //  7 kode
  S: [52, 53, 54, 55, 56, 57],                       //  6 kode
  H: [58, 59, 60, 61, 62, 63],                       //  6 kode
  R: [64, 65, 66, 67, 68, 69],                       //  6 kode
  D: [70, 71, 72, 73],                               //  4 kode
  L: [74, 75, 76, 77],                               //  4 kode
  C: [78, 79, 80],                                   //  3 kode
  U: [81, 82, 83],                                   //  3 kode
  M: [84, 85],                                       //  2 kode
  W: [86, 87],                                       //  2 kode
  F: [88, 89],                                       //  2 kode
  G: [90],                                           //  1 kode
  Y: [91],                                           //  1 kode
  P: [92],                                           //  1 kode
  B: [93],                                           //  1 kode
  V: [94],                                           //  1 kode
  K: [95],                                           //  1 kode
  J: [96],                                           //  1 kode
  X: [97],                                           //  1 kode
  Q: [98],                                           //  1 kode
  Z: [99],                                           //  1 kode
};

/**
 * Reverse lookup: kode numerik (0–99) → huruf.
 * Dibangun satu kali saat modul dimuat untuk efisiensi dekripsi.
 */
const REVERSE: Record<number, string> = {};
for (const [letter, codes] of Object.entries(HOMOPHONES)) {
  for (const code of codes) {
    REVERSE[code] = letter;
  }
}

/**
 * Homophonic Substitution Cipher — setiap huruf dipetakan ke salah satu dari
 * beberapa kode numerik 2-digit secara acak. Huruf yang sering muncul mendapat
 * lebih banyak pilihan kode sehingga distribusi frekuensi ciphertext merata.
 *
 * Enkripsi: huruf → pilih kode acak → 2 digit (tanpa spasi)
 * Dekripsi: baca 2 digit per kode → reverse lookup → huruf
 * Non-huruf dibuang saat enkripsi. Input dekripsi harus berupa digit saja.
 */
export const homophonicCipher: CipherDefinition = {
  id: "homophonic",
  name: "Cipher Homofonik",
  category: "substitution",
  description:
    "Setiap huruf dipetakan ke beberapa simbol numerik berbeda. Huruf yang sering muncul (E, T, A...) mendapat lebih banyak pilihan kode, menyulitkan analisis frekuensi.",
  // Contoh statis — hasil enkripsi nyata akan berbeda karena sifatnya acak
  example: { plaintext: "HELLO", ciphertext: "5863747474" },
  params: [],
  encrypt(plaintext) {
    return plaintext
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("")
      .map((char) => {
        const codes = HOMOPHONES[char];
        // Pilih satu kode secara acak dari daftar kode milik huruf ini
        const code = codes[Math.floor(Math.random() * codes.length)];
        return code.toString().padStart(2, "0");
      })
      .join("");
  },
  decrypt(ciphertext) {
    // Bersihkan input: hanya ambil karakter digit
    const digits = ciphertext.replace(/\D/g, "");
    if (digits.length % 2 !== 0) {
      throw new Error(
        "Panjang ciphertext harus genap (setiap huruf dikodekan sebagai 2 digit).",
      );
    }
    if (digits.length === 0) return "";

    let result = "";
    for (let i = 0; i < digits.length; i += 2) {
      const code = parseInt(digits.slice(i, i + 2), 10);
      const letter = REVERSE[code];
      if (letter === undefined) {
        throw new Error(
          `Kode '${digits.slice(i, i + 2)}' tidak ditemukan dalam tabel homopon.`,
        );
      }
      result += letter;
    }
    return result;
  },
};
