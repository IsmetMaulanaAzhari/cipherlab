import { useCipher } from "../hooks/useCipher";
import { CipherSelector } from "../components/CipherSelector";
import { CipherInfo } from "../components/CipherInfo";
import { CipherForm } from "../components/CipherForm";
import { TextIO } from "../components/TextIO";
import { useRef, useEffect } from "react";

const LOGIC_HINTS: Record<string, string> = {
  caesar: "Substitusi linear: huruf digeser berdasarkan nilai shift modulo 26.",
  rot13: "Substitusi tetap: Caesar shift 13, sehingga encrypt dan decrypt identik.",
  atbash: "Substitusi cermin: A<->Z, B<->Y, dst. Bersifat self-inverse.",
  vigenere:
    "Substitusi polialfabetik: setiap huruf digeser oleh huruf kunci yang berulang.",
  playfair:
    "Substitusi digraf: teks diproses per pasangan huruf pada matriks 5x5.",
  affine:
    "Substitusi afine: E(x) = (a*x + b) mod 26, decrypt memakai invers modular a.",
  hill: "Substitusi matriks: pasangan huruf dikalikan matriks kunci 2x2 modulo 26.",
  enigma:
    "Substitusi rotor dinamis: rotor berputar tiap karakter, lalu sinyal dipantulkan reflector.",
  homophonic:
    "Substitusi probabilistik: satu huruf punya beberapa kode 2 digit untuk meratakan frekuensi.",
  railfence:
    "Transposisi zigzag: karakter disusun ke rel lalu dibaca per rel.",
  columnar:
    "Transposisi kolom: teks masuk tabel, lalu kolom dibaca menurut urutan alfabet kunci.",
  product:
    "Product cipher berlapis: Vigenere dulu, kemudian transposisi kolom.",
};

/**
 * Halaman utama — playground untuk enkripsi dan dekripsi teks.
 * Menyatukan semua komponen utama dengan state dari useCipher hook.
 */
export function Home() {
  const {
    ciphers,
    selectedCipher,
    mode,
    params,
    inputText,
    outputText,
    error,
    selectCipher,
    setMode,
    setParam,
    setInputText,
    livePreviewEnabled,
    setLivePreviewEnabled,
    convert,
    reset,
    swapTexts,
  } = useCipher();

  // Ref untuk auto-scroll ke form ketika cipher dipilih
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke form ketika cipher berubah
  useEffect(() => {
    if (selectedCipher && formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selectedCipher]);

  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-8) var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Hero section */}
      <div className="terminal-shell">
        <div className="terminal-header">
          <div className="terminal-dots" aria-hidden="true">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "var(--text-xs)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--text-secondary)",
            }}
          >
            CIPHERLAB // INTERACTIVE CLASSICAL CRYPTO CONSOLE
          </p>
        </div>
        <div style={{ padding: "var(--space-6)" }}>
          <h1
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "var(--text-3xl)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              margin: "0 0 var(--space-2) 0",
              lineHeight: "var(--leading-tight)",
            }}
          >
            Kriptografi{" "}
            <span style={{ color: "var(--text-accent)" }}>Klasik</span>
          </h1>
          <p
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: "var(--leading-normal)",
            }}
          >
            Eksperimen enkripsi dan dekripsi berbasis metode klasik, langsung di browser.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Cipher selector */}
      <CipherSelector
        ciphers={ciphers}
        selectedId={selectedCipher?.id ?? null}
        onSelect={selectCipher}
      />

      {/* Panel yang muncul setelah cipher dipilih */}
        {selectedCipher && (
          <div ref={formSectionRef}>
          <div
            className="terminal-shell"
            style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-3)" }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "var(--text-xs)",
                color: "var(--text-secondary)",
                letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase",
              }}
            >
              Logika Metode Aktif
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-normal)",
                color: "var(--text-primary)",
              }}
            >
              {LOGIC_HINTS[selectedCipher.id] ?? "Cipher aktif menggunakan aturan transformasi khusus sesuai implementasinya."}
            </p>
          </div>

          {/* Info panel */}
          <CipherInfo cipher={selectedCipher} />

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--border-subtle)" }} />

          {/* Form parameter + mode toggle */}
          {(selectedCipher.params.length > 0) ? (
            <CipherForm
              cipher={selectedCipher}
              params={params}
              mode={mode}
              onParamChange={setParam}
              onModeChange={setMode}
            />
          ) : (
            /* Cipher tanpa parameter (atbash, rot13) — hanya tampilkan mode toggle */
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  margin: 0,
                  fontFamily: "Rajdhani, sans-serif",
                }}
              >
                Mode
              </p>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                {(["encrypt", "decrypt"] as const).map((m) => {
                  const isActive = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        padding: "var(--space-2) var(--space-5)",
                        borderRadius: "var(--radius-base)",
                        border: isActive
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                        background: isActive ? "var(--accent)" : "transparent",
                        color: isActive ? "var(--bg-base)" : "var(--text-secondary)",
                        fontFamily: "Rajdhani, sans-serif",
                        fontWeight: 600,
                        fontSize: "var(--text-sm)",
                        letterSpacing: "var(--tracking-wide)",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      {m === "encrypt" ? "Enkripsi" : "Dekripsi"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--border-subtle)" }} />

          {/* Area input/output teks */}
          <TextIO
            mode={mode}
            inputText={inputText}
            outputText={outputText}
            error={error}
            livePreviewEnabled={livePreviewEnabled}
            onInputChange={setInputText}
            onConvert={convert}
            onSwap={swapTexts}
            onReset={reset}
            onToggleLivePreview={setLivePreviewEnabled}
              onChangeCipher={() => {
                selectCipher(""); // deselect cipher
                // Scroll back to cipher selector
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
          />
          </div>
      )}

      {/* Placeholder saat belum memilih cipher */}
      {!selectedCipher && (
        <div
          style={{
            border: "1px dashed var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-12)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              letterSpacing: "var(--tracking-wide)",
              margin: 0,
            }}
          >
            &gt; Pilih metode kriptografi di atas untuk memulai...
          </p>
        </div>
      )}
    </div>
  );
}
