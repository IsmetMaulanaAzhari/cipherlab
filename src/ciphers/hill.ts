import type { CipherDefinition } from "../types/cipher";

/**
 * Hitung invers modular a mod m (brute force, m=26).
 * Melempar Error jika tidak ada invers — artinya kunci tidak valid.
 */
function modInverse(a: number, m: number): number {
  const n = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((n * x) % m === 1) return x;
  }
  throw new Error(
    `Tidak ada invers modular untuk det=${a} mod 26. Coba kunci lain.`
  );
}

/**
 * Kalikan matriks 2×2 dengan vektor 2×1, hasilnya mod 26.
 */
function matMulVec(mat: number[][], vec: number[]): number[] {
  return [
    ((mat[0][0] * vec[0] + mat[0][1] * vec[1]) % 26 + 26) % 26,
    ((mat[1][0] * vec[0] + mat[1][1] * vec[1]) % 26 + 26) % 26,
  ];
}

/**
 * Hitung matriks invers 2×2 mod 26.
 * Rumus: K⁻¹ = det(K)⁻¹ * [[d, -b], [-c, a]] mod 26
 */
function matInverse2x2(mat: number[][]): number[][] {
  const a = mat[0][0];
  const b = mat[0][1];
  const c = mat[1][0];
  const d = mat[1][1];
  const det = ((a * d - b * c) % 26 + 26) % 26;
  const detInv = modInverse(det, 26); // melempar Error jika det tidak koprima dengan 26
  return [
    [((detInv * d) % 26 + 26) % 26, ((detInv * -b) % 26 + 26) % 26],
    [((detInv * -c) % 26 + 26) % 26, ((detInv * a) % 26 + 26) % 26],
  ];
}

/**
 * Bangun matriks kunci 2×2 dari 4 huruf pertama kunci.
 * Melempar Error jika kunci kurang dari 4 huruf alfabet.
 */
function buildKeyMatrix(key: string): number[][] {
  const letters = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (letters.length < 4) {
    throw new Error("Kunci harus mengandung minimal 4 huruf.");
  }
  const k = Array.from(letters.slice(0, 4)).map(
    (c) => c.charCodeAt(0) - 65
  );
  return [
    [k[0], k[1]],
    [k[2], k[3]],
  ];
}

/**
 * Hill Cipher — enkripsi digraf (pasangan huruf) menggunakan perkalian matriks 2×2 mod 26.
 * Kunci membentuk matriks 2×2; determinan kunci harus koprima dengan 26.
 * Input non-alfabet diabaikan; output selalu UPPERCASE.
 * Jika panjang plaintext ganjil, padding 'X' ditambahkan di akhir.
 */
export const hillCipher: CipherDefinition = {
  id: "hill",
  name: "Hill Cipher",
  category: "substitution",
  description:
    "Enkripsi berbasis aljabar linear: pasangan huruf dienkripsi menggunakan perkalian matriks 2×2 mod 26.",
  example: { plaintext: "HELLO", key: "HILL", ciphertext: "DRJIWR" },
  params: [
    {
      key: "key",
      label: "Kunci (min. 4 huruf)",
      type: "text",
      placeholder: "Contoh: HILL — menghasilkan matriks [[7,8],[11,11]]",
    },
  ],
  encrypt(plaintext, { key }) {
    const mat = buildKeyMatrix(key);

    // Validasi determinan: harus koprima dengan 26 agar dekripsi bisa dilakukan
    const det =
      ((mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]) % 26 + 26) % 26;
    modInverse(det, 26); // melempar Error jika tidak valid

    const letters = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    // Pad dengan 'X' jika jumlah huruf ganjil
    const padded = letters.length % 2 === 0 ? letters : letters + "X";

    let result = "";
    for (let i = 0; i < padded.length; i += 2) {
      const vec = [padded.charCodeAt(i) - 65, padded.charCodeAt(i + 1) - 65];
      const enc = matMulVec(mat, vec);
      result +=
        String.fromCharCode(enc[0] + 65) + String.fromCharCode(enc[1] + 65);
    }
    return result;
  },
  decrypt(ciphertext, { key }) {
    const mat = buildKeyMatrix(key);
    const matInv = matInverse2x2(mat); // melempar Error jika det tidak invertible

    const letters = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
    if (letters.length % 2 !== 0) {
      throw new Error("Panjang ciphertext harus genap untuk Hill Cipher.");
    }

    let result = "";
    for (let i = 0; i < letters.length; i += 2) {
      const vec = [letters.charCodeAt(i) - 65, letters.charCodeAt(i + 1) - 65];
      const dec = matMulVec(matInv, vec);
      result +=
        String.fromCharCode(dec[0] + 65) + String.fromCharCode(dec[1] + 65);
    }
    return result;
  },
};
