import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

/**
 * Header sticky dengan logo CipherLab dan navigasi.
 */
function Header() {
  const { pathname } = useLocation();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "56px",
        background: "rgba(10, 12, 15, 0.85)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        padding: "0 var(--space-8)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "var(--text-2xl)",
              letterSpacing: "var(--tracking-wide)",
              color: "var(--text-primary)",
            }}
          >
            CIPHER
          </span>
          <span
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "var(--text-2xl)",
              letterSpacing: "var(--tracking-wide)",
              color: "var(--text-accent)",
            }}
          >
            LAB
          </span>
        </Link>

        {/* Navigasi */}
        <nav style={{ display: "flex", gap: "var(--space-6)" }}>
          <Link
            to="/"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              textDecoration: "none",
              color: pathname === "/" ? "var(--text-accent)" : "var(--text-secondary)",
              borderBottom: pathname === "/" ? "1px solid var(--accent)" : "1px solid transparent",
              paddingBottom: "2px",
            }}
          >
            Playground
          </Link>
          <Link
            to="/about"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              textDecoration: "none",
              color: pathname === "/about" ? "var(--text-accent)" : "var(--text-secondary)",
              borderBottom:
                pathname === "/about" ? "1px solid var(--accent)" : "1px solid transparent",
              paddingBottom: "2px",
            }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

/**
 * Komponen root aplikasi dengan routing dan layout global.
 */
function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "var(--space-6) var(--space-8)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wider)",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          CipherLab — Kriptografi Klasik &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
