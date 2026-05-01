import type { CipherDefinition } from "../types/cipher";

/**
 * Caesar Cipher — geser setiap huruf sebanyak `shift` posisi dalam alfabet.
 * Karakter non-alfabet dibiarkan apa adanya.
 * Preserve case: huruf besar tetap besar, huruf kecil tetap kecil.
 */
export const caesarCipher: CipherDefinition = {
  id: "caesar",
  name: "Caesar Cipher",
  category: "substitution",
  description:
    "Metode substitusi sederhana yang menggeser setiap huruf sejauh N posisi dalam alfabet.",
  example: { plaintext: "HELLO", key: "shift: 3", ciphertext: "KHOOR" },
  params: [
    {
      key: "shift",
      label: "Shift (1–25)",
      type: "number",
      placeholder: "Contoh: 3",
      min: 1,
      max: 25,
    },
  ],
  encrypt(plaintext, { shift }) {
    const n = ((parseInt(shift, 10) % 26) + 26) % 26;
    return plaintext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + n) % 26) + base);
    });
  },
  decrypt(ciphertext, { shift }) {
    const n = ((parseInt(shift, 10) % 26) + 26) % 26;
    return this.encrypt(ciphertext, { shift: String(26 - n) });
  },
};
