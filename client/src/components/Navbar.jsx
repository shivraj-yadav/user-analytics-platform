import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🔍 CausalFunnel Analytics</div>

      <div style={styles.links}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(location.pathname === "/" ? styles.activeLink : {}),
          }}
        >
          📋 Sessions
        </Link>

        <Link
          to="/heatmap"
          style={{
            ...styles.link,
            ...(location.pathname === "/heatmap" ? styles.activeLink : {}),
          }}
        >
          🗺️ Heatmap
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: "15px 30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  brand: {
    color: "#00ff88",
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#aaa",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  activeLink: {
    color: "#ffffff",
    backgroundColor: "#16213e",
  },
};

export default Navbar;
