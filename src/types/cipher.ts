/**
 * Kategori metode kriptografi yang tersedia.
 */
export type CipherCategory = "substitution" | "transposition" | "product";

/**
 * Definisi tipe untuk parameter sebuah cipher.
 */
export interface CipherParam {
  key: string;
  label: string;
  type: "number" | "text";
  placeholder?: string;
  min?: number;
  max?: number;
}

/**
 * Definisi tipe untuk sebuah cipher.
 * Setiap cipher harus mengimplementasikan interface ini.
 */
export interface CipherDefinition {
  id: string;
  name: string;
  category: CipherCategory;
  description: string;
  example: { plaintext: string; key?: string; ciphertext: string };
  params: CipherParam[];
  encrypt: (plaintext: string, params: Record<string, string>) => string;
  decrypt: (ciphertext: string, params: Record<string, string>) => string;
}
