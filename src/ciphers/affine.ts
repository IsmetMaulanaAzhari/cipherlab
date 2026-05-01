import type { CipherDefinition } from "../types/cipher";

/** Nilai 'a' yang valid — harus koprima dengan 26 */
const VALID_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

/**
 * Hitung invers modular a mod m menggunakan brute force (m=26, sangat kecil).
 * Melempar Error jika tidak ada invers (seharusnya tidak terjadi jika a valid).
 */
function modInverse(a: number, m: number): number {
  const normalized = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((normalized * x) % m === 1) return x;
  }
  throw new Error(`Tidak ada invers modular untuk a=${a} mod ${m}.`);
}

/**
 * Affine Cipher — setiap huruf x dienkripsi menjadi (a*x + b) mod 26.
 * Memerlukan a yang koprima dengan 26 agar dekripsi bisa dilakukan.
 * Karakter non-alfabet dibiarkan apa adanya; huruf kecil/besar dipertahankan.
 */
export const affineCipher: CipherDefinition = {
  id: "affine",
  name: "Affine Cipher",
  category: "substitution",
  description:
    "Enkripsi menggunakan fungsi linear E(x) = (ax + b) mod 26, di mana a harus koprima dengan 26.",
  example: { plaintext: "HELLO", key: "a=5, b=8", ciphertext: "RCLLA" },
  params: [
    {
      key: "a",
      label: "Nilai a (koprima dengan 26)",
      type: "number",
      placeholder: "Contoh: 5 → valid: 1,3,5,7,9,11,15,17,19,21,23,25",
      min: 1,
      max: 25,
    },
    {
      key: "b",
      label: "Nilai b (0–25)",
      type: "number",
      placeholder: "Contoh: 8",
      min: 0,
      max: 25,
    },
  ],
  encrypt(plaintext, { a, b }) {
    const aVal = parseInt(a, 10);
    const bVal = ((parseInt(b, 10) % 26) + 26) % 26;
    if (!VALID_A.includes(aVal)) {
      throw new Error(
        `a=${aVal} tidak koprima dengan 26. Nilai valid: ${VALID_A.join(", ")}.`
      );
    }
    return plaintext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      const x = char.charCodeAt(0) - base;
      return String.fromCharCode(((aVal * x + bVal) % 26) + base);
    });
  },
  decrypt(ciphertext, { a, b }) {
    const aVal = parseInt(a, 10);
    const bVal = ((parseInt(b, 10) % 26) + 26) % 26;
    if (!VALID_A.includes(aVal)) {
      throw new Error(
        `a=${aVal} tidak koprima dengan 26. Nilai valid: ${VALID_A.join(", ")}.`
      );
    }
    const aInv = modInverse(aVal, 26);
    return ciphertext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      const y = char.charCodeAt(0) - base;
      return String.fromCharCode(
        ((aInv * ((y - bVal + 26) % 26)) % 26) + base
      );
    });
  },
};
