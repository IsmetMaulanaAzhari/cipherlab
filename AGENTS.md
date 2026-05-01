# CipherLab: Traditional Cryptography Playground

## Project Overview

**CipherLab** adalah website interaktif untuk enkripsi dan dekripsi teks menggunakan metode kriptografi klasik/tradisional. User memilih metode kriptografi, mengisi parameter yang diperlukan, lalu mengonversi teks bolak-balik antara *plaintext* dan *ciphertext*.

---

## Tech Stack

| Layer     | Teknologi                        |
|-----------|----------------------------------|
| Frontend  | React 19 + Vite                  |
| Styling   | Tailwind CSS v3                  |
| Language  | TypeScript                       |
| Routing   | React Router v6 (SPA)            |
| State     | Zustand atau React Context       |
| Deploy    | Vercel (static frontend)         |

> Tidak ada backend. Semua logika kriptografi berjalan di sisi klien (pure JavaScript/TypeScript).

---

## Struktur Direktori

```
cipherlab/
├── public/
│   └── favicon.ico
├── src/
│   ├── ciphers/              # Semua logika kriptografi, satu file per metode
│   │   ├── caesar.ts
│   │   ├── vigenere.ts
│   │   ├── atbash.ts
│   │   ├── rot13.ts
│   │   ├── railfence.ts
│   │   ├── playfair.ts
│   │   └── index.ts          # Re-export semua cipher + registry
│   ├── components/
│   │   ├── CipherSelector.tsx    # Dropdown/card grid untuk memilih metode
│   │   ├── CipherForm.tsx        # Form dinamis berdasarkan cipher yang dipilih
│   │   ├── TextIO.tsx            # Input/output plaintext ↔ ciphertext
│   │   ├── CipherInfo.tsx        # Penjelasan singkat metode yang dipilih
│   │   └── ui/                   # Komponen UI generik (Button, Input, Badge, dll.)
│   ├── pages/
│   │   ├── Home.tsx              # Landing page + selector
│   │   └── About.tsx             # Penjelasan singkat tentang kriptografi klasik
│   ├── hooks/
│   │   └── useCipher.ts          # Hook: state mode, cipher, key, teks, hasil
│   ├── types/
│   │   └── cipher.ts             # TypeScript types/interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── AGENTS.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## Cipher yang Harus Diimplementasikan

Setiap cipher **wajib** mengekspor interface berikut (lihat `src/types/cipher.ts`):

```typescript
export interface CipherDefinition {
  id: string;                        // slug unik, contoh: "caesar"
  name: string;                      // nama tampilan
  description: string;               // deskripsi singkat 1–2 kalimat
  params: CipherParam[];             // parameter yang dibutuhkan (key, shift, dll.)
  encrypt: (plaintext: string, params: Record<string, string>) => string;
  decrypt: (ciphertext: string, params: Record<string, string>) => string;
}

export interface CipherParam {
  key: string;           // nama field, contoh: "shift"
  label: string;         // label untuk form, contoh: "Shift Value"
  type: "number" | "text";
  placeholder?: string;
  min?: number;          // untuk type number
  max?: number;
}
```

### Daftar Cipher

| ID           | Nama           | Parameter                          | Catatan                                    |
|--------------|----------------|------------------------------------|--------------------------------------------|
| `caesar`     | Caesar Cipher  | `shift` (number, 1–25)             | Hanya huruf alfabet, preserve case         |
| `vigenere`   | Vigenère Cipher| `key` (text, only letters)         | Key diulang sesuai panjang plaintext       |
| `atbash`     | Atbash Cipher  | *(tidak ada)*                      | A↔Z, B↔Y, dst. Hanya alfabet              |
| `rot13`      | ROT13          | *(tidak ada)*                      | Caesar dengan shift=13, enkripsi=dekripsi  |
| `railfence`  | Rail Fence     | `rails` (number, 2–10)             | Zigzag transposisi                         |
| `playfair`   | Playfair Cipher| `key` (text, only letters)         | Gunakan matriks 5×5, I=J                   |

---

## Alur UI (User Flow)

```
1. User membuka halaman utama
       ↓
2. User memilih metode kriptografi (CipherSelector)
       ↓
3. Muncul form parameter sesuai metode (CipherForm)
   + penjelasan singkat metode (CipherInfo)
       ↓
4. User memilih MODE: [Enkripsi] atau [Dekripsi]
       ↓
5. User mengetik teks di input area
       ↓
6. Output muncul REAL-TIME atau setelah klik tombol [Konversi]
       ↓
7. Tombol [Salin Hasil] tersedia untuk menyalin ciphertext/plaintext
```

---

## Aturan Implementasi

### Logika Kriptografi (`src/ciphers/`)

- **Pure functions only** — tidak ada side effects, tidak ada state.
- Input teks non-alfabet (spasi, angka, tanda baca) **harus dipertahankan apa adanya** (pass-through) kecuali Playfair yang hanya menerima alfabet.
- Setiap file cipher harus punya **unit test** di `src/ciphers/__tests__/`.
- Contoh test case wajib ada untuk:
  - enkripsi menghasilkan output yang benar
  - dekripsi(enkripsi(x)) === x
  - input kosong tidak crash

### Registry (`src/ciphers/index.ts`)

```typescript
import { caesarCipher } from "./caesar";
import { vigenereCipher } from "./vigenere";
// ... dst

export const CIPHER_REGISTRY: CipherDefinition[] = [
  caesarCipher,
  vigenereCipher,
  atbashCipher,
  rot13Cipher,
  railFenceCipher,
  playfairCipher,
];

export function getCipherById(id: string): CipherDefinition | undefined {
  return CIPHER_REGISTRY.find((c) => c.id === id);
}
```

### Komponen (`src/components/`)

- **CipherSelector**: Tampilkan cipher sebagai card grid (bukan dropdown biasa). Setiap card menampilkan nama + deskripsi singkat.
- **CipherForm**: Render form secara dinamis berdasarkan `cipher.params`. Validasi input sebelum proses.
- **TextIO**: Dua textarea berdampingan (atau atas-bawah di mobile) — kiri input, kanan output. Tombol swap untuk balik mode enkripsi/dekripsi.
- **CipherInfo**: Tampilkan nama cipher, deskripsi, dan contoh enkripsi singkat (hardcoded per cipher).

### Validasi & Error Handling

- Tampilkan pesan error inline jika:
  - Parameter wajib kosong
  - Tipe parameter salah (contoh: shift berisi huruf)
  - Plaintext/ciphertext kosong saat tombol diklik
- Jangan crash — semua error harus ditangkap dan ditampilkan ke user.

---

## Desain & Styling

- Tema: **dark mode** dengan aksen warna terminal/monospace (hijau atau amber di atas gelap). Aesthetic: retro-cyberpunk / hacker terminal.
- Font: gunakan font monospace untuk area teks input/output (contoh: `JetBrains Mono`, `Fira Code`, atau `IBM Plex Mono` dari Google Fonts).
- Responsif: mobile-first. Breakpoint utama di `md` (768px).
- Tidak boleh menggunakan template UI siap pakai (shadcn, daisyUI, dll.) kecuali diminta — buat komponen sendiri dengan Tailwind.

---

## Coding Conventions

- Semua kode ditulis dalam **TypeScript strict mode**.
- Gunakan `const` dan arrow functions; hindari `var`.
- Nama komponen PascalCase, nama fungsi/variabel camelCase.
- Tidak ada `any` type — selalu definisikan type yang jelas.
- Komentar ditulis dalam **Bahasa Indonesia**.
- Setiap fungsi cipher wajib ada komentar JSDoc singkat yang menjelaskan algoritmanya.

---

## Urutan Pengerjaan (untuk Agent)

Ikuti urutan ini agar tidak ada dependensi yang belum siap:

1. **Setup project** — `npm create vite@latest`, install Tailwind, konfigurasi TypeScript strict.
2. **Buat types** — `src/types/cipher.ts` (interface `CipherDefinition`, `CipherParam`).
3. **Implementasi semua cipher** — satu per satu di `src/ciphers/`, mulai dari yang paling sederhana: `atbash` → `rot13` → `caesar` → `vigenere` → `railfence` → `playfair`.
4. **Buat cipher registry** — `src/ciphers/index.ts`.
5. **Buat hook** — `src/hooks/useCipher.ts` yang mengelola state: `selectedCipher`, `mode` (encrypt/decrypt), `params`, `inputText`, `outputText`.
6. **Buat komponen UI** — urutan: `CipherSelector` → `CipherForm` → `TextIO` → `CipherInfo`.
7. **Rakit halaman** — `src/pages/Home.tsx` menggunakan semua komponen di atas.
8. **Styling & polish** — terapkan tema dark terminal, animasi transisi antar cipher.
9. **Unit tests** — buat test untuk setiap cipher.

---

## Contoh: Caesar Cipher (`src/ciphers/caesar.ts`)

```typescript
import type { CipherDefinition } from "../types/cipher";

/**
 * Caesar Cipher — geser setiap huruf sebanyak `shift` posisi dalam alfabet.
 * Karakter non-alfabet dibiarkan apa adanya.
 */
export const caesarCipher: CipherDefinition = {
  id: "caesar",
  name: "Caesar Cipher",
  description:
    "Metode substitusi sederhana yang menggeser setiap huruf sejauh N posisi dalam alfabet.",
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
    const n = ((parseInt(shift) % 26) + 26) % 26;
    return plaintext.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + n) % 26) + base);
    });
  },
  decrypt(ciphertext, { shift }) {
    const n = ((parseInt(shift) % 26) + 26) % 26;
    return this.encrypt(ciphertext, { shift: String(26 - n) });
  },
};
```

---

## Out of Scope (Jangan Diimplementasikan)

- Backend / API server
- Autentikasi / login user
- Menyimpan history enkripsi ke database
- Cipher modern (AES, RSA, SHA, dll.)
- File upload / enkripsi file

---

*Dokumen ini adalah sumber kebenaran tunggal untuk agent. Jika ada ambiguitas, prioritaskan aturan di dokumen ini di atas asumsi default.*
