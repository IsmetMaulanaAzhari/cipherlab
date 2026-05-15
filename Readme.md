# CipherLab - Dokumentasi Sistem

Dokumen ini menjelaskan cara kerja aplikasi CipherLab, alur enkripsi/dekripsi, serta seluruh metode kriptografi yang tersedia di website.

## 1. Ringkasan Aplikasi

CipherLab adalah aplikasi web frontend (React + TypeScript + Vite) untuk belajar kriptografi klasik.
Semua proses enkripsi dan dekripsi dilakukan di sisi klien (browser), tanpa backend.

Kategori metode yang tersedia:
- Substitusi
- Transposisi
- Product Cipher (super enkripsi)

## 2. Cara Menjalankan

1. Install dependency:
   - `npm install`
2. Jalankan mode development:
   - `npm run dev`
3. Build produksi:
   - `npm run build`
4. Jalankan test:
   - `npm run test`

## 3. Arsitektur Singkat

Komponen utama sistem:
- `src/ciphers/`: Implementasi algoritma cipher (pure function)
- `src/ciphers/index.ts`: Registry semua cipher
- `src/hooks/useCipher.ts`: State utama enkripsi/dekripsi + validasi + eksekusi
- `src/components/`: UI selector, form parameter, info cipher, dan input/output
- `src/pages/Home.tsx`: Integrasi seluruh alur pengguna

## 4. Alur Sistem Enkripsi dan Dekripsi

Alur dari sudut pandang user:
1. User memilih metode cipher di CipherSelector.
2. Sistem menyimpan metode terpilih sebagai `selectedCipher`.
3. User mengisi parameter (jika ada), memilih mode (`encrypt` atau `decrypt`), lalu mengetik teks input.
4. User menekan tombol Konversi.
5. Hook `useCipher.convert()` melakukan validasi.
6. Jika valid:
   - mode `encrypt`: panggil `selectedCipher.encrypt(inputText, params)`
   - mode `decrypt`: panggil `selectedCipher.decrypt(inputText, params)`
7. Hasil disimpan ke `outputText` dan ditampilkan pada panel output.
8. User dapat:
   - Salin hasil
   - Balik (swap input-output sekaligus membalik mode)
   - Reset

### 4.1 Validasi Global di Hook

Sebelum algoritma dipanggil, sistem mengecek:
- Cipher sudah dipilih
- Input tidak kosong
- Semua parameter wajib terisi
- Untuk parameter bertipe number:
  - harus angka
  - harus memenuhi batas min/max jika ditentukan
- Untuk parameter bertipe text:
  - harus mengandung setidaknya satu huruf

Jika gagal validasi, `error` ditampilkan inline di UI tanpa crash.

### 4.2 Tombol Balik (Swap)

Fitur swap di `useCipher.swapTexts()` melakukan:
- `inputText <- outputText`
- `outputText <- inputText`
- mode berubah otomatis:
  - `encrypt` menjadi `decrypt`
  - `decrypt` menjadi `encrypt`

Ini memudahkan proses bolak-balik enkripsi <-> dekripsi tanpa mengetik ulang.

## 5. Daftar Metode dan Cara Kerjanya

Di bawah ini adalah perilaku aktual semua metode pada implementasi saat ini.

### 5.0 Metode Ini "Pakai Apa" Sebenarnya?

Ringkasnya, tiap metode memakai jenis logika yang berbeda:

| Metode | Pakai logika apa | Intinya |
|---|---|---|
| Caesar | Aritmetika modulo 26 | Geser huruf sejumlah shift |
| ROT13 | Aritmetika modulo 26 | Shift tetap 13 (self-inverse) |
| Atbash | Pemetaan cermin alfabet | A<->Z, B<->Y |
| Vigenere | Substitusi polialfabetik + modulo | Shift berubah sesuai huruf kunci |
| Playfair | Digraf + matriks 5x5 + aturan posisi | Enkripsi per pasangan huruf |
| Affine | Fungsi linear modular | E(x)=(a*x+b) mod 26 |
| Hill | Aljabar linear (matriks 2x2) mod 26 | Vektor huruf dikali matriks kunci |
| Enigma | Rotor wiring + stepping stateful | Mapping berubah tiap karakter |
| Homophonic | Substitusi probabilistik (random codebook) | 1 huruf punya banyak kode |
| Rail Fence | Transposisi pola zigzag | Posisi karakter diacak, huruf tidak diganti |
| Columnar | Transposisi tabel kolom | Baca kolom berdasar urutan kunci |
| Product | Komposisi dua cipher | Vigenere lalu Columnar |

### 5.1 Caesar Cipher (`caesar`)

- Kategori: Substitusi monoalfabetik
- Parameter: `shift` (1-25)
- Mekanisme enkripsi: geser huruf sejauh N posisi (mod 26)
- Mekanisme dekripsi: geser balik (atau shift komplemen)
- Non-huruf: dipertahankan
- Case: dipertahankan
- Contoh: `HELLO` + shift 3 -> `KHOOR`

### 5.2 ROT13 (`rot13`)

- Kategori: Substitusi
- Parameter: tidak ada
- Mekanisme: Caesar dengan shift tetap 13
- Sifat: self-inverse (encrypt = decrypt)
- Non-huruf: dipertahankan
- Case: dipertahankan
- Contoh: `HELLO` -> `URYYB`

### 5.3 Atbash (`atbash`)

- Kategori: Substitusi
- Parameter: tidak ada
- Mekanisme: alfabet dicerminkan (A<->Z, B<->Y, dst)
- Sifat: self-inverse
- Non-huruf: dipertahankan
- Case: dipertahankan
- Contoh: `HELLO` -> `SVOOL`

### 5.4 Vigenere Cipher (`vigenere`)

- Kategori: Substitusi polialfabetik
- Parameter: `key` (teks)
- Mekanisme enkripsi: tiap huruf digeser sesuai huruf kunci (kunci diulang)
- Mekanisme dekripsi: penggeseran negatif dengan kunci yang sama
- Kunci dinormalisasi: hanya huruf, uppercase
- Non-huruf pada input: dipertahankan
- Contoh: `HELLO` + key `KEY` -> `RIJVS`

### 5.5 Playfair Cipher (`playfair`)

- Kategori: Substitusi digraf
- Parameter: `key` (teks)
- Mekanisme:
  - Bangun matriks 5x5 dari kunci (I/J digabung, J -> I)
  - Plaintext dibersihkan ke huruf uppercase saja
  - Bentuk pasangan huruf (digraf)
  - Jika pasangan huruf sama, sisipkan X
  - Jika jumlah huruf ganjil, tambah X di akhir
  - Terapkan aturan baris/kolom/persegi
- Catatan: output bersih huruf uppercase (tanpa spasi/tanda baca)

### 5.6 Affine Cipher (`affine`)

- Kategori: Substitusi
- Parameter:
  - `a` (harus koprima dengan 26)
  - `b` (0-25)
- Mekanisme enkripsi: E(x) = (a*x + b) mod 26
- Mekanisme dekripsi: D(y) = a^-1 * (y - b) mod 26
- Validasi penting: jika `a` tidak punya invers modular, proses gagal dengan error
- Non-huruf: dipertahankan
- Case: dipertahankan

### 5.7 Hill Cipher (`hill`)

- Kategori: Substitusi berbasis matriks
- Parameter: `key` (minimal 4 huruf)
- Mekanisme:
  - Ambil 4 huruf pertama key -> matriks 2x2
  - Plaintext dibersihkan ke huruf uppercase saja
  - Jika ganjil, tambah padding X
  - Enkripsi per pasangan huruf via perkalian matriks mod 26
- Dekripsi memakai invers matriks mod 26
- Validasi penting: determinan matriks harus invertible mod 26
- Catatan: output uppercase, non-huruf tidak dipertahankan

### 5.8 Enigma Machine (`enigma`)

- Kategori: Substitusi (simulasi rotor)
- Parameter:
  - `rotors` (3 angka unik dari 1-5)
  - `positions` (3 huruf A-Z)
- Mekanisme:
  - Pilih 3 rotor dari wiring historis
  - Step rotor terjadi sebelum tiap huruf diproses
  - Sinyal maju rotor -> reflector -> balik rotor
  - Menggunakan aturan turnover dan double-stepping
- Sifat: self-inverse (dengan setting yang sama)
- Non-huruf: dipertahankan
- Case: dipertahankan

### 5.9 Homophonic Cipher (`homophonic`)

- Kategori: Substitusi homofonik
- Parameter: tidak ada
- Mekanisme enkripsi:
  - Tiap huruf A-Z dipetakan ke salah satu kode angka 2 digit
  - Pemilihan kode acak dari daftar homophone huruf itu
- Mekanisme dekripsi:
  - Baca ciphertext per 2 digit
  - Mapping balik digit -> huruf
- Karakteristik penting:
  - Hasil enkripsi bersifat non-deterministik (input sama bisa hasil beda)
  - Enkripsi membuang non-huruf dan menghasilkan digit saja
  - Dekripsi mengharuskan jumlah digit genap

### 5.10 Rail Fence (`railfence`)

- Kategori: Transposisi
- Parameter: `rails` (2-10)
- Mekanisme enkripsi:
  - Teks ditulis zigzag ke sejumlah rel
  - Hasil ciphertext dibaca per rel
- Mekanisme dekripsi:
  - Bentuk ulang pola zigzag
  - Rekonstruksi urutan asli karakter
- Karakter penting:
  - Spasi/tanda baca ikut diproses sebagai karakter
  - Jika rails <=1 atau rails >= panjang teks, teks dikembalikan apa adanya

### 5.11 Cipher Transposisi Kolom (`columnar`)

- Kategori: Transposisi
- Parameter: `key` (teks)
- Mekanisme enkripsi:
  - Ambil huruf saja, uppercase
  - Tulis ke tabel baris x kolom (kolom = panjang key)
  - Padding X hingga tabel penuh
  - Baca kolom berdasarkan urutan alfabet karakter key
- Mekanisme dekripsi:
  - Tentukan dimensi tabel
  - Isi ulang kolom sesuai urutan yang sama
  - Baca tabel per baris
- Catatan: non-huruf dibuang pada proses

### 5.12 Super Enkripsi / Product Cipher (`product`)

- Kategori: Product
- Parameter:
  - `vigKey` (kunci Vigenere)
  - `transKey` (kunci transposisi kolom)
- Mekanisme enkripsi:
  1) plaintext huruf saja -> Vigenere
  2) hasil Vigenere -> Columnar
- Mekanisme dekripsi:
  1) ciphertext -> inverse Columnar
  2) hasil -> inverse Vigenere
- Catatan: ini chaining dua algoritma (substitusi + transposisi)

## 6. Perbedaan Penting Antar Metode

Tidak semua metode memperlakukan karakter non-huruf dengan cara yang sama:

- Non-huruf dipertahankan:
  - Caesar, ROT13, Atbash, Vigenere, Affine, Enigma, Rail Fence
- Non-huruf dibuang / normalisasi huruf saja:
  - Playfair, Hill, Columnar, Product, Homophonic (saat enkripsi)

Karena itu, untuk beberapa metode hasil dekripsi bisa berbentuk teks yang sudah dinormalisasi (uppercase, tanpa spasi/tanda baca, bisa ada padding X).

## 7. Pengujian

Seluruh metode diuji di:
- `src/ciphers/__tests__/ciphers.test.ts`

Cakupan test meliputi:
- Hasil enkripsi contoh dasar
- Koreksi dekripsi
- Sifat round-trip (`decrypt(encrypt(x))`)
- Validasi input dan error case
- Input kosong tidak crash

## 8. Kesimpulan

Secara sistem, perubahan dari enkripsi ke dekripsi dikontrol oleh state `mode` pada hook `useCipher`.
Sistem tidak memiliki logika terpisah di UI per metode; UI hanya memilih cipher dan mengirim parameter.
Logika inti selalu delegasi ke fungsi `encrypt/decrypt` milik cipher yang aktif.

Dengan desain ini, penambahan cipher baru cukup dengan:
1. Membuat file cipher baru yang sesuai interface
2. Menambahkan ke registry `CIPHER_REGISTRY`
3. UI otomatis dapat merender parameter dan menjalankan algoritma melalui alur yang sama

## Contoh Interaktif

CipherLab kini menyediakan panel _Contoh Interaktif_ pada halaman utama. Panel ini berisi contoh siap pakai untuk beberapa cipher populer (mis. Caesar, Vigenère, Enigma, Hill). Fitur ini memungkinkan pengguna untuk:

- Memuat contoh ke form parameter dan area input dengan satu klik
- Mencoba variasi parameter tanpa mengetik manual
- Memahami perbedaan perilaku tiap cipher dengan cepat

Lokasi komponen contoh: `src/components/CipherExamples.tsx`.

Menambah contoh baru:

1. Buka `src/components/CipherExamples.tsx`.
2. Tambahkan objek contoh baru di array `EXAMPLES` dengan properti `cipherId`, `params`, `input`, dan `mode`.

Contoh pengembang:

```ts
// contoh baru di EXAMPLES
{
  id: "my-example",
  cipherId: "caesar",
  name: "Caesar example",
  description: "Shift 5",
  params: { shift: "5" },
  input: "HELLO",
  mode: "encrypt",
}
```

## Catatan Pengembang

- Komponen contoh menggunakan hook `useCipher()` untuk mengisi state aplikasi (memanggil `selectCipher`, `setParam`, `setInputText`, dll.).
- Pastikan nama parameter yang digunakan di `params` cocok dengan `cipher.params` pada definisi cipher.
- Jalankan test suite setelah perubahan:

```bash
npm install
npm test
```

