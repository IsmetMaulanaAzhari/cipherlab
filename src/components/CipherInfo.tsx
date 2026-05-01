import { useEffect, useRef } from "react";
import type { CipherDefinition } from "../types/cipher";

interface CipherInfoProps {
  cipher: CipherDefinition;
}

/**
 * Panel yang menampilkan informasi detail tentang cipher yang dipilih,
 * termasuk nama, deskripsi, dan contoh enkripsi.
 */
export function CipherInfo({ cipher }: CipherInfoProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Animasi masuk saat cipher berubah
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(4px)";
    const t = requestAnimationFrame(() => {
      el.style.transition = "opacity 200ms ease, transform 200ms ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(t);
  }, [cipher.id]);

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid var(--border-active)",
        borderRadius: "var(--radius-base)",
        background: "var(--bg-elevated)",
        padding: "var(--space-5)",
        opacity: 0,
      }}
    >
      {/* Header dengan nama cipher */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          paddingBottom: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        <h3
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "var(--text-lg)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--text-accent)",
            margin: 0,
          }}
        >
          {cipher.name}
        </h3>
      </div>

      {/* Deskripsi cipher */}
      <p
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "var(--text-base)",
          color: "var(--text-secondary)",
          lineHeight: "var(--leading-normal)",
          margin: "0 0 var(--space-4) 0",
        }}
      >
        {cipher.description}
      </p>

      {/* Blok contoh enkripsi */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-base)",
          padding: "var(--space-3) var(--space-4)",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 var(--space-2) 0",
          }}
        >
          Contoh:
        </p>
        <code
          style={{
            fontFamily: "'JetBrains Mono', 'Share Tech Mono', monospace",
            fontSize: "var(--text-sm)",
            color: "var(--text-accent)",
            display: "block",
          }}
        >
          &quot;{cipher.example.plaintext}&quot;
          {cipher.example.key && (
            <span style={{ color: "var(--text-secondary)" }}>
              {" "}
              + {cipher.example.key}
            </span>
          )}
          {" → "}
          <strong style={{ color: "var(--text-accent)" }}>
            &quot;{cipher.example.ciphertext}&quot;
          </strong>
        </code>
      </div>
    </div>
  );
}
