# CipherLab Visual Specification

## Konsep Visual

**Aesthetic direction:** Retro hacker terminal — seperti membuka program enkripsi di terminal tahun 80-an, tapi dengan polish modern.

**Kata kunci:** Phosphor glow · Monochrome + satu aksen · Ketelitian militer · Dense tapi breathable

**Referensi mood:** Matrix terminal, old-school IBM mainframe UI, War Games (1983)

---

## Color Palette

Gunakan CSS custom properties di `:root`. Semua warna HARUS direferensikan via variabel, tidak boleh hardcode hex.

```css
:root {
  /* Background */
  --bg-base:       #0a0c0f;   /* Hitam sangat gelap, bukan pure black */
  --bg-surface:    #111318;   /* Card, panel, input background */
  --bg-elevated:   #181c23;   /* Dropdown, modal, tooltip */
  --bg-overlay:    #1e2330;   /* Hover state pada card */

  /* Primary Accent — Amber/Phosphor */
  --accent:        #f0a500;   /* Warna utama: tombol aktif, highlight, cursor */
  --accent-dim:    #a87200;   /* Aksen redup: border aktif, label */
  --accent-glow:   rgba(240, 165, 0, 0.15); /* Box-shadow glow efek */

  /* Text */
  --text-primary:  #e8e6d9;   /* Teks utama — off-white kekuningan */
  --text-secondary:#8a8678;   /* Label, placeholder, deskripsi */
  --text-muted:    #4a4840;   /* Disabled, hint */
  --text-accent:   #f0a500;   /* Teks yang di-highlight */

  /* Semantic */
  --success:       #4caf7d;   /* Valid, berhasil */
  --error:         #e05c5c;   /* Error, invalid */
  --warning:       #e0a84a;   /* Peringatan */

  /* Border */
  --border:        #252830;   /* Border default */
  --border-active: #f0a500;   /* Border saat focus/active */
  --border-subtle: #1a1d24;   /* Border sangat redup */

  /* Misc */
  --scanline-opacity: 0.03;   /* Opacity efek scanline di background */
}
```

---

## Typography

### Font Families

```css
/* Import di index.css */
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

| Peran           | Font             | Fallback              |
|-----------------|------------------|-----------------------|
| Display/Heading | `Rajdhani`       | sans-serif            |
| Body / UI Label | `Rajdhani`       | sans-serif            |
| Input / Output  | `JetBrains Mono` | `Share Tech Mono`, monospace |
| Cipher result   | `Share Tech Mono`| monospace             |

### Type Scale

```css
:root {
  --text-xs:   0.75rem;    /* 12px — badge, hint */
  --text-sm:   0.875rem;   /* 14px — label, caption */
  --text-base: 1rem;       /* 16px — body default */
  --text-lg:   1.125rem;   /* 18px — subheading */
  --text-xl:   1.375rem;   /* 22px — section title */
  --text-2xl:  1.75rem;    /* 28px — page title */
  --text-3xl:  2.5rem;     /* 40px — hero */

  --leading-tight:  1.2;
  --leading-normal: 1.5;
  --leading-code:   1.7;   /* Untuk textarea monospace */

  --tracking-wide:  0.08em;  /* Heading uppercase */
  --tracking-wider: 0.15em;  /* Badge, label all-caps */
}
```

---

## Spacing & Layout

```css
:root {
  /* Spacing scale (4px base) */
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */

  /* Layout */
  --container-max:  1100px;
  --sidebar-width:  280px;
  --content-width:  720px;

  /* Radius */
  --radius-sm:   2px;
  --radius-base: 4px;
  --radius-md:   6px;
  --radius-lg:   10px;

  /* Border width */
  --border-width: 1px;
  --border-width-thick: 2px;
}
```

---

## Component Specifications

### 1. Cipher Card (di CipherSelector)

```
┌──────────────────────────────┐
│ ▸ CAESAR CIPHER        [←→] │  ← nama cipher (Rajdhani Bold, uppercase)
│                              │
│  Geser setiap huruf sejauh   │  ← deskripsi (Rajdhani Regular, --text-secondary)
│  N posisi dalam alfabet.     │
└──────────────────────────────┘
```

**States:**
- **Default:** `bg: --bg-surface`, `border: --border`, no glow
- **Hover:** `bg: --bg-overlay`, `border: --border-active`, subtle `box-shadow: 0 0 12px var(--accent-glow)`
- **Selected/Active:** `border: --accent`, `border-width: 2px`, background tint `--accent-glow`, label berubah jadi `--text-accent`

**Ukuran:** min-height `100px`, padding `--space-5`, border-radius `--radius-base`

---

### 2. Input / Textarea

```
PLAINTEXT ─────────────────────
│                              │
│  ketik teks di sini...       │
│                              │
└──────────────────────────────┘
```

- Font: `JetBrains Mono`, `--text-base`
- Background: `--bg-surface`
- Border: `1px solid --border` → focus: `1px solid --accent`
- Border-radius: `--radius-base`
- Padding: `--space-4`
- Line-height: `--leading-code`
- Resize: vertical only
- Label di atas: uppercase, `--tracking-wider`, `--text-xs`, `--text-secondary`
- Focus ring: `box-shadow: 0 0 0 2px var(--accent-glow)`

---

### 3. Button

**Varian Primary (Konversi / Enkripsi):**
- Background: `--accent`
- Text: `--bg-base` (hitam di atas amber)
- Font: `Rajdhani SemiBold`, uppercase, `--tracking-wide`
- Padding: `--space-3 --space-6`
- Radius: `--radius-base`
- Hover: brightness naik 10%, slight glow
- Active: brightness turun 10%

**Varian Ghost (Salin, Swap):**
- Background: transparent
- Border: `1px solid --border-active`
- Text: `--accent`
- Hover: background `--accent-glow`

**Varian Danger (Reset):**
- Background: transparent
- Border: `1px solid --error`
- Text: `--error`

---

### 4. Parameter Input (CipherForm)

Untuk input angka (shift) dan teks (key):

```
SHIFT VALUE
┌────────────────┐
│  3             │
└────────────────┘
  Range: 1 – 25
```

- Label: uppercase, `--text-xs`, `--tracking-wider`, `--text-secondary`
- Input: sama dengan textarea styling, tinggi `--space-10`
- Helper text: `--text-xs`, `--text-muted`, di bawah input
- Error state: border `--error`, helper text berubah merah

---

### 5. Mode Toggle (Enkripsi ↔ Dekripsi)

```
[ ENKRIPSI ]   [ DEKRIPSI ]
```

- Dua tombol berdampingan dalam satu container
- Active state: background `--accent`, text `--bg-base`
- Inactive state: background transparent, border `--border`, text `--text-secondary`
- Transisi: `0.15s ease`
- Lebar container: `fit-content`, tidak stretch

---

### 6. CipherInfo Panel

Panel yang muncul di bawah selector ketika cipher dipilih:

```
╔══════════════════════════════════╗
║  VIGENÈRE CIPHER                 ║
╠══════════════════════════════════╣
║  Substitusi polialfabetik        ║
║  menggunakan kata kunci sebagai  ║
║  kunci enkripsi.                 ║
║                                  ║
║  Contoh: "HELLO" + key "KEY"     ║
║  → "RIJVS"                       ║
╚══════════════════════════════════╝
```

- Border: `--border-active`, radius `--radius-base`
- Background: `--bg-elevated`
- Contoh: font monospace, `--text-accent`
- Animasi masuk: `opacity 0→1` + `translateY(4px→0)`, durasi `200ms`

---

## Efek & Animasi

### Scanline Background
Tambahkan efek scanline halus di seluruh halaman menggunakan pseudo-element atau SVG pattern:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0, var(--scanline-opacity)) 2px,
    rgba(0,0,0, var(--scanline-opacity)) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

### Glow pada Output
Ketika ciphertext berhasil digenerate, textarea output mendapat efek:
```css
box-shadow: 0 0 20px var(--accent-glow), inset 0 0 10px rgba(240,165,0,0.05);
```

### Transisi Global
```css
* {
  transition-property: color, background-color, border-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease;
}
```

### Cursor Blinking (opsional, untuk textarea output)
Tambahkan kelas `.cursor-blink::after` dengan animasi blink untuk kesan terminal.

---

## Layout Halaman Utama

### Desktop (≥768px)

```
┌──────────────────────────────────────────────────┐
│  CIPHERLAB                          [About]       │  ← Header (sticky)
├──────────────────────────────────────────────────┤
│                                                  │
│  Pilih Metode Kriptografi:                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │  ← Cipher cards (grid)
│  │Caesar│ │Vigen.│ │Atbsh │ │ROT13 │ │ ...  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ VIGENÈRE CIPHER — penjelasan singkat       │  │  ← CipherInfo
│  └────────────────────────────────────────────┘  │
│                                                  │
│  KEY ──────────  [ ENKRIPSI ] [ DEKRIPSI ]       │  ← Params + mode toggle
│  ┌──────────┐                                    │
│  │ secretkey│                                    │
│  └──────────┘                                    │
│                                                  │
│  PLAINTEXT ────────  CIPHERTEXT ──────────       │
│  ┌──────────────┐    ┌──────────────┐            │  ← TextIO (dua kolom)
│  │              │    │              │            │
│  │              │    │              │            │
│  └──────────────┘    └──────────────┘            │
│           [ KONVERSI ]    [ SALIN HASIL ]         │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Mobile (<768px)

- Cipher cards: `grid-cols-2` (2 kolom)
- TextIO: stack vertikal (input di atas, output di bawah)
- Params: full width
- Header: tanpa nav, hanya logo

---

## Header

- Tinggi: `56px`
- Background: `--bg-base` dengan `border-bottom: 1px solid --border`
- Logo: `CIPHER` (Rajdhani Bold, `--text-2xl`, `--text-primary`) + `LAB` (Rajdhani Bold, `--text-2xl`, `--text-accent`)
- Posisi: sticky top, `z-index: 100`
- Efek: `backdrop-filter: blur(8px)` dengan sedikit transparansi

---

## Dos and Don'ts

**✅ DO:**
- Semua warna via CSS variables
- Gunakan `--radius-base` (4px) — jangan rounded-full untuk elemen UI utama
- Teks heading: uppercase + letter-spacing
- Textarea selalu monospace
- Animasi: fast (100–200ms), subtle

**❌ DON'T:**
- Jangan pakai warna putih murni (`#ffffff`) — pakai `--text-primary`
- Jangan pakai biru atau ungu — palette ini amber-only
- Jangan border-radius besar (>10px) kecuali modal overlay
- Jangan animasi lebih dari 300ms untuk interaksi UI
- Jangan gunakan shadow gelap di atas background gelap — pakai glow (amber) sebagai gantinya

---

*Dokumen ini adalah sumber kebenaran tunggal untuk semua keputusan visual. Jika ada konflik antara DESIGN.md dan kode, DESIGN.md yang menang.*
