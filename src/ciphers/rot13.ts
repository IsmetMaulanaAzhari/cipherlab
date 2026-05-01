import type { CipherDefinition } from "../types/cipher";

/**
 * ROT13 — Caesar Cipher khusus dengan shift tetap 13.
 * Karena 13+13=26, enkripsi dan dekripsi adalah operasi yang sama.
 * Hanya mempengaruhi huruf alfabet, karakter lain dipertahankan.
 */
export const rot13Cipher: CipherDefinition = {
  id: "rot13",
  name: "ROT13",
  category: "substitution",
  description:
    "Varian Caesar Cipher dengan pergeseran tetap 13. Enkripsi dan dekripsi adalah operasi yang identik.",
  example: { plaintext: "HELLO", ciphertext: "URYYB" },
  params: [],
  encrypt(plaintext) {
    return plaintext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + 13) % 26) + base,
      );
    });
  },
  decrypt(ciphertext) {
    // ROT13 bersifat self-inverse
    return this.encrypt(ciphertext, {});
  },
};
