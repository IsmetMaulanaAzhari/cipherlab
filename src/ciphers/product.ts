import type { CipherDefinition } from "../types/cipher";
import { vigenereCipher } from "./vigenere";
import { columnarCipher } from "./columnar";

/**
 * Product Cipher / Super Enkripsi — menggabungkan dua lapisan kriptografi:
 *
 * Lapisan 1 — Vigenère Cipher (substitusi polialfabetik):
 *   Setiap huruf digeser sesuai huruf kunci yang bersesuaian, diulang
 *   sepanjang plaintext. Menyulitkan analisis frekuensi sederhana.
 *
 * Lapisan 2 — Columnar Transposition (transposisi kolom):
 *   Hasil substitusi ditulis dalam tabel, lalu dibaca per kolom sesuai
 *   urutan alfabetis kunci transposisi. Mengubah posisi karakter.
 *
 * Enkripsi: plaintext (hanya huruf) → Vigenère → Columnar → ciphertext
 * Dekripsi: ciphertext → Columnar balik → Vigenère balik → plaintext
 *
 * Menggabungkan kedua metode secara berurutan memberikan keamanan yang
 * jauh lebih kuat daripada masing-masing metode secara individual.
 *
 * Terverifikasi: "HELLO" + vigKey:"KEY", transKey:"LOCK"
 *   Vigenère("HELLO", KEY)  = "RIJVS"  (H+K=R, E+E=I, L+Y=J, L+K=V, O+E=S)
 *   Columnar("RIJVS", LOCK) → tabel RIJVS + pad "X":
 *     L(0) O(1) C(2) K(3)   →  R I J V
 *                               S X X X
 *     Sort: C(2)<K(3)<L(0)<O(1)
 *     Baca col2→"JX", col3→"VX", col0→"RS", col1→"IX" → "JXVXRSIX"
 *   Catatan: example di bawah menggunakan nilai aktual yang terverifikasi.
 */
export const productCipher: CipherDefinition = {
  id: "product",
  name: "Super Enkripsi",
  category: "product",
  description:
    "Kombinasi Vigenère (substitusi) dan Transposisi Kolom. Pesan dienkripsi dua kali — substitusi terlebih dahulu, kemudian transposisi — untuk keamanan yang lebih kuat.",
  example: {
    plaintext: "HELLO",
    key: "vigKey: KEY, transKey: LOCK",
    ciphertext: "JXVXRSIX",
  },
  params: [
    {
      key: "vigKey",
      label: "Kunci Vigenère",
      type: "text",
      placeholder: "Contoh: SECRET",
    },
    {
      key: "transKey",
      label: "Kunci Transposisi",
      type: "text",
      placeholder: "Contoh: KUNCI",
    },
  ],
  encrypt(plaintext, { vigKey, transKey }) {
    // Normalisasi: hanya huruf sebelum diproses (kedua cipher menginginkan teks bersih)
    const lettersOnly = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    if (lettersOnly.length === 0) return "";

    // Tahap 1: enkripsi Vigenère
    const afterVigenere = vigenereCipher.encrypt(lettersOnly, { key: vigKey });

    // Tahap 2: enkripsi Columnar Transposition
    return columnarCipher.encrypt(afterVigenere, { key: transKey });
  },
  decrypt(ciphertext, { vigKey, transKey }) {
    if (ciphertext.replace(/[^A-Z]/gi, "").length === 0) return "";

    // Tahap 1: balik Columnar Transposition terlebih dahulu
    const afterColumnar = columnarCipher.decrypt(ciphertext, { key: transKey });

    // Tahap 2: balik Vigenère
    return vigenereCipher.decrypt(afterColumnar, { key: vigKey });
  },
};
