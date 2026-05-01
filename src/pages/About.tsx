/**
 * Halaman About — penjelasan singkat tentang kriptografi klasik
 * dan metode yang tersedia di CipherLab.
 */

interface CipherCard {
  name: string;
  era: string;
  type: string;
  desc: string;
}

const CIPHER_INFO: CipherCard[] = [
  {
    name: "Caesar Cipher",
    era: "~58 SM",
    type: "Substitusi Monoalfabetik",
    desc: "Dikaitkan dengan Julius Caesar. Menggeser setiap huruf dalam alfabet sejauh N posisi. Mudah dipecahkan dengan analisis frekuensi.",
  },
  {
    name: "Atbash Cipher",
    era: "~600 SM",
    type: "Substitusi Monoalfabetik",
    desc: "Berasal dari tradisi Ibrani kuno. Mencerminkan alfabet: A↔Z, B↔Y, dll. Digunakan dalam teks religius seperti Kitab Yeremia.",
  },
  {
    name: "ROT13",
    era: "~1980-an",
    type: "Substitusi Monoalfabetik",
    desc: "Varian Caesar dengan shift 13. Populer di forum internet awal untuk menyembunyikan spoiler. Enkripsi dan dekripsi adalah operasi yang sama.",
  },
  {
    name: "Vigenère Cipher",
    era: "1553",
    type: "Substitusi Polialfabetik",
    desc: "Dipublikasikan oleh Giovan Battista Bellaso, keliru dikaitkan ke Blaise de Vigenère. Menggunakan kata kunci berulang. Disebut \"le chiffre indéchiffrable\" selama berabad-abad.",
  },
  {
    name: "Rail Fence Cipher",
    era: "~abad 19",
    type: "Transposisi",
    desc: "Teknik transposisi zigzag. Teks ditulis bergelombang melintasi beberapa baris, lalu dibaca per baris. Digunakan di masa Perang Saudara Amerika.",
  },
  {
    name: "Playfair Cipher",
    era: "1854",
    type: "Substitusi Digraf",
    desc: "Diciptakan oleh Charles Wheatstone, dipopulerkan oleh Lord Playfair. Mengenkripsi pasangan huruf (digraf) menggunakan matriks 5×5. Digunakan oleh Inggris dalam Perang Dunia I dan II.",
  },
];

export function About() {
  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "Rajdhani, sans-serif",
    fontWeight: 700,
    fontSize: "var(--text-xl)",
    letterSpacing: "var(--tracking-wide)",
    textTransform: "uppercase",
    color: "var(--text-accent)",
    margin: "0 0 var(--space-4) 0",
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "Rajdhani, sans-serif",
    fontSize: "var(--text-base)",
    color: "var(--text-secondary)",
    lineHeight: "var(--leading-normal)",
    margin: 0,
  };

  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-10)",
      }}
    >
      {/* Hero */}
      <div>
        <h1
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "var(--text-3xl)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            margin: "0 0 var(--space-3) 0",
            lineHeight: "var(--leading-tight)",
          }}
        >
          Tentang{" "}
          <span style={{ color: "var(--text-accent)" }}>Kriptografi Klasik</span>
        </h1>
        <p style={{ ...bodyStyle, fontSize: "var(--text-lg)" }}>
          Kriptografi klasik adalah seni menyandikan pesan yang berkembang jauh sebelum era
          komputer. Metode-metode ini menjadi fondasi ilmu kriptografi modern.
        </p>
      </div>

      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Apa itu Kriptografi */}
      <section>
        <h2 style={sectionTitleStyle}>Apa Itu Kriptografi?</h2>
        <p style={bodyStyle}>
          Kriptografi (dari bahasa Yunani <em>kryptos</em> = tersembunyi, <em>graphein</em> =
          menulis) adalah ilmu dan seni mengamankan komunikasi dengan mengubah pesan asli
          (plaintext) menjadi format yang tidak dapat dibaca (ciphertext), dan sebaliknya.
          Tujuan utamanya adalah menjaga kerahasiaan, integritas, dan keaslian informasi.
        </p>
      </section>

      {/* Jenis Cipher */}
      <section>
        <h2 style={sectionTitleStyle}>Jenis Cipher Klasik</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {[
            {
              type: "Substitusi",
              desc: "Setiap karakter dalam plaintext diganti dengan karakter lain berdasarkan aturan tertentu. Dibagi menjadi monoalfabetik (satu-satu) dan polialfabetik (banyak kemungkinan per karakter).",
              examples: "Caesar, Atbash, ROT13, Vigenère, Playfair",
            },
            {
              type: "Transposisi",
              desc: "Karakter plaintext tidak diubah, tetapi urutan atau posisinya diacak sesuai pola tertentu. Tanpa mengubah huruf itu sendiri.",
              examples: "Rail Fence, Columnar Transposition",
            },
          ].map((item) => (
            <div
              key={item.type}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-base)",
                padding: "var(--space-5)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "var(--text-lg)",
                  color: "var(--text-primary)",
                  margin: "0 0 var(--space-2) 0",
                }}
              >
                {item.type}
              </h3>
              <p style={{ ...bodyStyle, marginBottom: "var(--space-3)" }}>{item.desc}</p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-accent)",
                  margin: 0,
                }}
              >
                Contoh: {item.examples}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Cipher cards */}
      <section>
        <h2 style={sectionTitleStyle}>Cipher di CipherLab</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {CIPHER_INFO.map((cipher) => (
            <div
              key={cipher.name}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-base)",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {/* Header card */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "var(--text-base)",
                      letterSpacing: "var(--tracking-wide)",
                      textTransform: "uppercase",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {cipher.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {cipher.era}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "var(--tracking-wider)",
                    textTransform: "uppercase",
                    color: "var(--accent-dim)",
                    background: "var(--accent-glow)",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {cipher.type}
                </span>
              </div>

              {/* Deskripsi */}
              <p style={bodyStyle}>{cipher.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kelemahan */}
      <section>
        <h2 style={sectionTitleStyle}>Mengapa Cipher Klasik Tidak Aman?</h2>
        <p style={{ ...bodyStyle, marginBottom: "var(--space-4)" }}>
          Semua cipher klasik rentan terhadap teknik analisis modern:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[
            {
              label: "Analisis Frekuensi",
              desc: "Huruf dan kata dalam sebuah bahasa memiliki frekuensi kemunculan yang khas. Dengan menganalisis frekuensi simbol dalam ciphertext, penyerang dapat menebak pola enkripsi.",
            },
            {
              label: "Brute Force",
              desc: "Caesar Cipher hanya memiliki 25 kemungkinan shift — komputer modern dapat mencoba semuanya dalam hitungan milidetik.",
            },
            {
              label: "Known Plaintext Attack",
              desc: "Jika penyerang mengetahui sepasang plaintext-ciphertext, mereka dapat merekonstruksi kunci enkripsi.",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderLeft: "2px solid var(--accent-dim)",
                paddingLeft: "var(--space-4)",
              }}
            >
              <p
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: "0 0 var(--space-1) 0",
                }}
              >
                {item.label}
              </p>
              <p style={bodyStyle}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div
        style={{
          border: "1px solid var(--warning)",
          borderRadius: "var(--radius-base)",
          background: "rgba(224, 168, 74, 0.05)",
          padding: "var(--space-5)",
        }}
      >
        <p
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-sm)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--warning)",
            margin: "0 0 var(--space-2) 0",
          }}
        >
          ⚠ Perhatian
        </p>
        <p style={bodyStyle}>
          CipherLab adalah alat edukatif. Cipher klasik <strong style={{ color: "var(--text-primary)" }}>tidak aman</strong> untuk
          melindungi informasi sensitif di era modern. Untuk keamanan data nyata, gunakan
          enkripsi modern seperti AES-256 atau RSA.
        </p>
      </div>
    </div>
  );
}
