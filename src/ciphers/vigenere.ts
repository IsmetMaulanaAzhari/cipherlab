import type { CipherDefinition } from "../types/cipher";

/**
 * Vigenère Cipher — substitusi polialfabetik menggunakan kata kunci.
 * Setiap huruf digeser sesuai huruf kunci yang bersesuaian (diulang).
 * Hanya huruf alfabet yang diproses, karakter lain dipertahankan.
 */
export const vigenereCipher: CipherDefinition = {
  id: "vigenere",
  name: "Vigenère Cipher",
  category: "substitution",
  description:
    "Substitusi polialfabetik menggunakan kata kunci yang diulang sepanjang plaintext.",
  example: { plaintext: "HELLO", key: "KEY", ciphertext: "RIJVS" },
  params: [
    {
      key: "key",
      label: "Kunci (hanya huruf)",
      type: "text",
      placeholder: "Contoh: SECRET",
    },
  ],
  encrypt(plaintext, { key }) {
    // Normalisasi kunci: hanya ambil huruf, ubah ke uppercase
    const normalizedKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (normalizedKey.length === 0) return plaintext;
    let keyIndex = 0;
    return plaintext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      const shift =
        normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 65;
      keyIndex++;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + shift) % 26) + base,
      );
    });
  },
  decrypt(ciphertext, { key }) {
    const normalizedKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (normalizedKey.length === 0) return ciphertext;
    let keyIndex = 0;
    return ciphertext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      const shift =
        normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 65;
      keyIndex++;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base - shift + 26) % 26) + base,
      );
    });
  },
};
