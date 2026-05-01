import type { CipherDefinition, CipherCategory } from "../types/cipher";

interface CipherSelectorProps {
  ciphers: CipherDefinition[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Label tampilan untuk setiap kategori */
const CATEGORY_LABELS: Record<CipherCategory, string> = {
  substitution: "Teknik Substitusi",
  transposition: "Teknik Transposisi",
  product: "Product Cipher — Super Enkripsi",
};

/** Ikon kategori */
const CATEGORY_ICONS: Record<CipherCategory, string> = {
  substitution: "⟳",
  transposition: "⇄",
  product: "⊕",
};

/** Urutan tampilan kategori */
const CATEGORY_ORDER: CipherCategory[] = [
  "substitution",
  "transposition",
  "product",
];

/**
 * Menampilkan daftar cipher sebagai card grid interaktif,
 * dikelompokkan berdasarkan kategori (Substitusi, Transposisi, Product).
 */
export function CipherSelector({
  ciphers,
  selectedId,
  onSelect,
}: CipherSelectorProps) {
  // Kelompokkan cipher berdasarkan kategori
  const grouped = ciphers.reduce<Record<CipherCategory, CipherDefinition[]>>(
    (acc, cipher) => {
      if (!acc[cipher.category]) acc[cipher.category] = [];
      acc[cipher.category].push(cipher);
      return acc;
    },
    { substitution: [], transposition: [], product: [] },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      {CATEGORY_ORDER.map((category) => {
        const items = grouped[category];
        if (!items || items.length === 0) return null;

        return (
          <div key={category}>
            {/* Header kategori */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "var(--text-base)",
                  color: "var(--accent)",
                }}
              >
                {CATEGORY_ICONS[category]}
              </span>
              <h2
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "var(--text-base)",
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                {CATEGORY_LABELS[category]}
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--border)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-muted)",
                }}
              >
                {items.length} metode
              </span>
            </div>

            {/* Grid card cipher */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              {items.map((cipher) => {
                const isSelected = cipher.id === selectedId;
                return (
                  <CipherCard
                    key={cipher.id}
                    cipher={cipher}
                    isSelected={isSelected}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sub-komponen: Card individual ───────────────────────────────────────────

interface CipherCardProps {
  cipher: CipherDefinition;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function CipherCard({ cipher, isSelected, onSelect }: CipherCardProps) {
  return (
    <button
      onClick={() => onSelect(cipher.id)}
      style={{
        background: isSelected ? "var(--accent-glow)" : "var(--bg-surface)",
        border: isSelected
          ? "2px solid var(--accent)"
          : "1px solid var(--border)",
        borderRadius: "var(--radius-base)",
        padding: "var(--space-4) var(--space-5)",
        textAlign: "left",
        cursor: "pointer",
        minHeight: "90px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        width: "100%",
        boxShadow: isSelected ? "0 0 12px var(--accent-glow)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          const el = e.currentTarget;
          el.style.background = "var(--bg-overlay)";
          el.style.borderColor = "var(--border-active)";
          el.style.boxShadow = "0 0 12px var(--accent-glow)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          const el = e.currentTarget;
          el.style.background = "var(--bg-surface)";
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "none";
        }
      }}
    >
      {/* Indikator + nama */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
      >
        <span
          style={{
            color: isSelected ? "var(--text-accent)" : "var(--text-muted)",
            fontSize: "var(--text-xs)",
            lineHeight: 1,
          }}
        >
          ▸
        </span>
        <span
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "var(--text-sm)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: isSelected ? "var(--text-accent)" : "var(--text-primary)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {cipher.name}
        </span>
      </div>

      {/* Deskripsi singkat */}
      <p
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
          lineHeight: "var(--leading-normal)",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {cipher.description}
      </p>
    </button>
  );
}
