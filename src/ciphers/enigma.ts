import type { CipherDefinition } from "../types/cipher";

/**
 * Wiring rotor historis Enigma (Wehrmacht/Luftwaffe).
 * Indeks 0 = Rotor I, ..., Indeks 4 = Rotor V.
 * Setiap string merepresentasikan pemetaan A→[0], B→[1], ..., Z→[25].
 */
const ROTOR_WIRINGS = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ", // Rotor I
  "AJDKSIRUXBLHWTMCQGZNPYFVOE", // Rotor II
  "BDFHJLCPRTXVZNYEIWGAKMUSQO", // Rotor III
  "ESOVPZJAYQUIRHXLNFTGKDCMWB", // Rotor IV
  "VZBRGITYUPSDNHLXAWMJQOFECK", // Rotor V
] as const;

/**
 * Posisi notch (turnover) untuk setiap rotor.
 * Ketika rotor berada di posisi notch-nya, rotor di kirinya akan berputar.
 * I=Q(16), II=E(4), III=V(21), IV=J(9), V=Z(25)
 */
const ROTOR_NOTCHES = [16, 4, 21, 9, 25] as const;

/**
 * Wiring reflector UKW-B (Umkehrwalze B).
 * Reflector memetakan setiap huruf ke huruf lain secara simetris (self-inverse).
 */
const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

/**
 * Bangun tabel wiring invers dari sebuah string wiring.
 * Diperlukan untuk arah sinyal balik (kiri ke kanan).
 */
function buildInverse(wiring: string): number[] {
  const inv = new Array<number>(26).fill(0);
  for (let i = 0; i < 26; i++) {
    inv[wiring.charCodeAt(i) - 65] = i;
  }
  return inv;
}

/**
 * Lakukan langkah (stepping) rotor sebelum memproses setiap karakter.
 * Mengimplementasikan double-stepping anomaly Enigma:
 * - Jika rotor TENGAH (indeks 1) berada di notch-nya → step KIRI dan TENGAH
 * - else jika rotor KANAN (indeks 2) berada di notch-nya → step TENGAH
 * - Selalu step KANAN
 */
function stepRotors(pos: number[], notches: readonly number[]): number[] {
  const p = [...pos];
  if (p[1] === notches[1]) {
    // Double-stepping: rotor tengah mendorong rotor kiri sekaligus ikut maju
    p[0] = (p[0] + 1) % 26;
    p[1] = (p[1] + 1) % 26;
  } else if (p[2] === notches[2]) {
    // Rotor kanan di notch → step rotor tengah
    p[1] = (p[1] + 1) % 26;
  }
  // Rotor kanan selalu berputar
  p[2] = (p[2] + 1) % 26;
  return p;
}

/**
 * Enkripsi satu karakter melalui seluruh alur sinyal Enigma:
 * Masuk kanan→kiri (Rotor III→II→I) → Reflector → balik kiri→kanan (Rotor I→II→III).
 *
 * Untuk setiap rotor ke arah maju:
 *   in_contact = (signal + pos) % 26
 *   out_contact = fwd[in_contact]
 *   signal_keluar = (out_contact - pos + 26) % 26
 *
 * Untuk arah balik, gunakan tabel invers wiring.
 */
function encryptChar(
  code: number,
  fwd: number[][],
  bwd: number[][],
  pos: number[],
  ref: number[],
): number {
  let s = code;

  // Arah maju: kanan ke kiri (indeks 2 → 1 → 0)
  for (let i = 2; i >= 0; i--) {
    s = (fwd[i][(s + pos[i]) % 26] - pos[i] + 26) % 26;
  }

  // Lewati reflector
  s = ref[s];

  // Arah balik: kiri ke kanan (indeks 0 → 1 → 2)
  for (let i = 0; i < 3; i++) {
    s = (bwd[i][(s + pos[i]) % 26] - pos[i] + 26) % 26;
  }

  return s;
}

/**
 * Parse dan validasi parameter rotor dan posisi awal dari input pengguna.
 * Mengembalikan indeks rotor (0-based) dan posisi awal (0-based, A=0).
 */
function parseParams(
  rotors: string,
  positions: string,
): { rNums: number[]; initPos: number[] } {
  const rNums = rotors
    .trim()
    .split(/[\s,]+/)
    .map((r) => parseInt(r, 10) - 1);

  if (
    rNums.length !== 3 ||
    rNums.some((r) => isNaN(r) || r < 0 || r > 4)
  ) {
    throw new Error("Rotor harus 3 angka antara 1–5, contoh: 1 2 3");
  }
  if (new Set(rNums).size !== 3) {
    throw new Error("Ketiga rotor harus berbeda (tidak boleh ada yang sama).");
  }

  const clean = positions.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length !== 3) {
    throw new Error("Posisi awal harus tepat 3 huruf A–Z, contoh: AAA");
  }

  return {
    rNums,
    initPos: Array.from(clean).map((c) => c.charCodeAt(0) - 65),
  };
}

/**
 * Jalankan seluruh proses Enigma pada teks masukan.
 * Karena Enigma bersifat self-inverse, fungsi ini digunakan untuk
 * enkripsi maupun dekripsi dengan pengaturan yang sama.
 * Non-huruf dipertahankan tanpa perubahan.
 */
function runEnigma(text: string, rNums: number[], initPos: number[]): string {
  // Bangun tabel wiring maju untuk setiap rotor yang dipilih
  const fwd: number[][] = rNums.map((r) =>
    Array.from(ROTOR_WIRINGS[r]).map((c) => c.charCodeAt(0) - 65),
  );
  // Bangun tabel wiring invers untuk setiap rotor yang dipilih
  const bwd: number[][] = rNums.map((r) => buildInverse(ROTOR_WIRINGS[r]));
  // Bangun tabel reflector
  const ref: number[] = Array.from(REFLECTOR).map((c) => c.charCodeAt(0) - 65);
  // Notch untuk setiap rotor yang dipilih
  const notches = rNums.map((r) => ROTOR_NOTCHES[r]) as number[];

  let pos = [...initPos];
  let result = "";

  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      // Step rotor SEBELUM memproses karakter (mekanisme Enigma)
      pos = stepRotors(pos, notches as readonly number[]);
      const code = char.toUpperCase().charCodeAt(0) - 65;
      const enc = encryptChar(code, fwd, bwd, pos, ref);
      // Pertahankan case asli
      result +=
        char >= "a"
          ? String.fromCharCode(enc + 97)
          : String.fromCharCode(enc + 65);
    } else {
      // Non-huruf dipertahankan apa adanya
      result += char;
    }
  }

  return result;
}

/**
 * Enigma Machine — simulasi mesin enkripsi rotor historis (Wehrmacht/Luftwaffe).
 * Menggunakan 3 rotor yang dapat dikonfigurasi dari 5 rotor tersedia (I–V),
 * reflector UKW-B, dan mengimplementasikan double-stepping anomaly.
 *
 * Sifat self-inverse: encrypt(encrypt(x, settings), settings) === x
 * Terverifikasi: "HELLO" + rotor 1 2 3, posisi AAA → "ILBDA"
 */
export const enigmaCipher: CipherDefinition = {
  id: "enigma",
  name: "Enigma Machine",
  category: "substitution",
  description:
    "Simulasi mesin Enigma historis dengan 3 rotor yang dapat dikonfigurasi dan reflector UKW-B. Enkripsi dan dekripsi menggunakan pengaturan yang sama (self-inverse).",
  example: { plaintext: "HELLO", key: "rotors: 1 2 3, pos: AAA", ciphertext: "ILBDA" },
  params: [
    {
      key: "rotors",
      label: "Rotor (3 angka 1–5, unik)",
      type: "text",
      placeholder: "Contoh: 1 2 3",
    },
    {
      key: "positions",
      label: "Posisi Awal (3 huruf A–Z)",
      type: "text",
      placeholder: "Contoh: AAA",
    },
  ],
  encrypt(plaintext, { rotors, positions }) {
    const { rNums, initPos } = parseParams(rotors, positions);
    return runEnigma(plaintext, rNums, initPos);
  },
  decrypt(ciphertext, { rotors, positions }) {
    // Enigma bersifat self-inverse: proses dekripsi identik dengan enkripsi
    const { rNums, initPos } = parseParams(rotors, positions);
    return runEnigma(ciphertext, rNums, initPos);
  },
};
