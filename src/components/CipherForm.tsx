import type { CSSProperties } from "react";
import type { CipherDefinition } from "../types/cipher";
import type { CipherMode } from "../hooks/useCipher";

interface CipherFormProps {
  cipher: CipherDefinition;
  params: Record<string, string>;
  mode: CipherMode;
  onParamChange: (key: string, value: string) => void;
  onModeChange: (mode: CipherMode) => void;
}

/**
 * Form dinamis yang merender input parameter sesuai cipher yang dipilih,
 * ditambah toggle mode enkripsi/dekripsi.
 */
export function CipherForm({
  cipher,
  params,
  mode,
  onParamChange,
  onModeChange,
}: CipherFormProps) {
  const inputStyle: CSSProperties = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-base)",
    padding: "var(--space-3) var(--space-4)",
    color: "var(--text-primary)",
    fontFamily: "'JetBrains Mono', 'Share Tech Mono', monospace",
    fontSize: "var(--text-base)",
    height: "var(--space-10)",
    width: "100%",
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

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: "var(--space-6)",
      }}
    >
      {/* Render input untuk setiap parameter cipher */}
      {cipher.params.map((param) => (
        <div key={param.key} style={{ minWidth: "160px", flex: "1 1 160px" }}>
          <label style={labelStyle}>{param.label}</label>
          <input
            type={param.type === "number" ? "number" : "text"}
            value={params[param.key] ?? ""}
            placeholder={param.placeholder}
            min={param.min}
            max={param.max}
            onChange={(e) => onParamChange(param.key, e.target.value)}
            style={inputStyle}
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
      ))}

      {/* Toggle mode enkripsi / dekripsi */}
      <div>
        <p style={{ ...labelStyle, marginBottom: "var(--space-2)" }}>Mode</p>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {(["encrypt", "decrypt"] as CipherMode[]).map((m) => {
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => onModeChange(m)}
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
                  transition: "all 0.15s ease",
                }}
              >
                {m === "encrypt" ? "Enkripsi" : "Dekripsi"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
