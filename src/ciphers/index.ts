import { caesarCipher } from "./caesar";
import { rot13Cipher } from "./rot13";
import { homophonicCipher } from "./homophonic";
import { vigenereCipher } from "./vigenere";
import { playfairCipher } from "./playfair";
import { affineCipher } from "./affine";
import { hillCipher } from "./hill";
import { enigmaCipher } from "./enigma";
import { atbashCipher } from "./atbash";
import { railFenceCipher } from "./railfence";
import { columnarCipher } from "./columnar";
import { productCipher } from "./product";
import type { CipherDefinition, CipherCategory } from "../types/cipher";

/**
 * Registry semua cipher yang tersedia, dikelompokkan berdasarkan kategori.
 * Urutan: Substitusi → Transposisi → Product Cipher
 */
export const CIPHER_REGISTRY: CipherDefinition[] = [
  // ── Teknik Substitusi ────────────────────────────────
  caesarCipher,
  rot13Cipher,
  homophonicCipher,
  vigenereCipher,
  playfairCipher,
  affineCipher,
  hillCipher,
  enigmaCipher,
  atbashCipher,
  // ── Teknik Transposisi ───────────────────────────────
  columnarCipher,
  railFenceCipher,
  // ── Product Cipher (Super Enkripsi) ──────────────────
  productCipher,
];

/**
 * Cari cipher berdasarkan ID-nya.
 * @param id - slug unik cipher (contoh: "caesar")
 */
export function getCipherById(id: string): CipherDefinition | undefined {
  return CIPHER_REGISTRY.find((c) => c.id === id);
}

/**
 * Ambil semua cipher dalam satu kategori.
 */
export function getCiphersByCategory(
  category: CipherCategory,
): CipherDefinition[] {
  return CIPHER_REGISTRY.filter((c) => c.category === category);
}
