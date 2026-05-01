import { useState } from "react";
import type { CSSProperties } from "react";
import type { CipherMode } from "../hooks/useCipher";

interface TextIOProps {
  mode: CipherMode;
  inputText: string;
  outputText: string;
  error: string | null;
  onInputChange: (text: string) => void;
  onConvert: () => void;
  onSwap: () => void;
  onReset: () => void;
}

/**
 * Komponen dua textarea berdampingan (atau bertumpuk di mobile):
 * kiri untuk input, kanan untuk output hasil konversi.
 * Dilengkapi tombol Konversi, Salin, Swap, dan Reset.
 */
export function TextIO({
  mode,
  inputText,
  outputText,
  error,
  onInputChange,
  onConvert,
  onSwap,
  onReset,
}: TextIOProps) {
  const [copied, setCopied] = useState(false);

  // Salin output ke clipboard
  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback diam-diam jika browser tidak mendukung clipboard API
    }
  };

  const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: "160px",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-base)",
    padding: "var(--space-4)",
    color: "var(--text-primary)",
    fontFamily: "'JetBrains Mono', 'Share Tech Mono', monospace",
    fontSize: "var(--text-base)",
    lineHeight: "var(--leading-code)",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "var(--text-xs)",
    letterSpacing: "var(--tracking-wider)",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    marginBottom: "var(--space-2)",
    fontFamily: "Rajdhani, sans-serif",
  };

  const inputLabel = mode === "encrypt" ? "Plaintext" : "Ciphertext";
  const outputLabel = mode === "encrypt" ? "Ciphertext" : "Plaintext";

  return (
    <div>
      {/* Area dua textarea berdampingan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
        className="text-io-grid"
      >
        {/* Textarea input (plaintext atau ciphertext) */}
        <div>
          <label style={labelStyle}>{inputLabel}</label>
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Ketik ${inputLabel.toLowerCase()} di sini...`}
            style={textareaStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--border-active)";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px var(--accent-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Textarea output (read-only) */}
        <div>
          <label style={labelStyle}>{outputLabel}</label>
          <textarea
            readOnly
            value={outputText}
            placeholder={`Hasil ${outputLabel.toLowerCase()} akan muncul di sini...`}
            style={{
              ...textareaStyle,
              background: outputText
                ? "var(--bg-elevated)"
                : "var(--bg-surface)",
              color: outputText ? "var(--text-accent)" : "var(--text-muted)",
              boxShadow: outputText
                ? "0 0 20px var(--accent-glow), inset 0 0 10px rgba(240,165,0,0.05)"
                : "none",
              cursor: "default",
            }}
          />
        </div>
      </div>

      {/* Pesan error inline */}
      {error && (
        <p
          style={{
            marginTop: "var(--space-3)",
            fontSize: "var(--text-sm)",
            color: "var(--error)",
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          ⚠ {error}
        </p>
      )}

      {/* Baris tombol aksi */}
      <div
        style={{
          marginTop: "var(--space-4)",
          display: "flex",
          gap: "var(--space-3)",
          flexWrap: "wrap",
        }}
      >
        {/* Tombol Konversi (utama) */}
        <button
          onClick={onConvert}
          style={{
            padding: "var(--space-3) var(--space-6)",
            background: "var(--accent)",
            color: "var(--bg-base)",
            border: "none",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "filter 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          {mode === "encrypt" ? "Enkripsi" : "Dekripsi"}
        </button>

        {/* Tombol Salin Hasil */}
        <button
          onClick={handleCopy}
          disabled={!outputText}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: outputText ? "var(--accent)" : "var(--text-muted)",
            border: outputText
              ? "1px solid var(--accent-dim)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: outputText ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (outputText)
              e.currentTarget.style.background = "var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {copied ? "✓ Tersalin!" : "Salin Hasil"}
        </button>

        {/* Tombol Swap — tukar input ↔ output dan balik mode */}
        <button
          onClick={onSwap}
          disabled={!outputText}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: outputText ? "var(--accent)" : "var(--text-muted)",
            border: outputText
              ? "1px solid var(--accent-dim)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: outputText ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (outputText)
              e.currentTarget.style.background = "var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          ⇄ Balik
        </button>

        {/* Tombol Reset — bersihkan semua teks dan parameter */}
        <button
          onClick={onReset}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: "var(--error)",
            border: "1px solid var(--error)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.15s ease, opacity 0.15s ease",
            opacity: 0.7,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.background = "rgba(224,92,92,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
