import type { CipherDefinition } from "../types/cipher";

/**
 * Atbash Cipher — cerminkan alfabet: A↔Z, B↔Y, dst.
 * Hanya karakter alfabet yang diubah, karakter lain dipertahankan.
 * Enkripsi dan dekripsi menghasilkan operasi yang sama (self-inverse).
 */
export const atbashCipher: CipherDefinition = {
  id: "atbash",
  name: "Atbash Cipher",
  category: "substitution",
  description:
    "Substitusi sederhana yang mencerminkan alfabet: A menjadi Z, B menjadi Y, dan seterusnya.",
  example: { plaintext: "HELLO", ciphertext: "SVOOL" },
  params: [],
  encrypt(plaintext) {
    return plaintext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
    });
  },
  decrypt(ciphertext) {
    // Atbash bersifat self-inverse — enkripsi = dekripsi
    return this.encrypt(ciphertext, {});
  },
};
