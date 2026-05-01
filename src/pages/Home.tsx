import { useCipher } from "../hooks/useCipher";
import { CipherSelector } from "../components/CipherSelector";
import { CipherInfo } from "../components/CipherInfo";
import { CipherForm } from "../components/CipherForm";
import { TextIO } from "../components/TextIO";

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
    convert,
    reset,
    swapTexts,
  } = useCipher();

  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      {/* Hero section */}
      <div>
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
          Enkripsi dan dekripsi teks menggunakan metode kriptografi tradisional.
        </p>
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
        <>
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
            onInputChange={setInputText}
            onConvert={convert}
            onSwap={swapTexts}
            onReset={reset}
          />
        </>
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
