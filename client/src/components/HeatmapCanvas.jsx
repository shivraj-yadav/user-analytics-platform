import { useEffect, useRef } from "react";

const HeatmapCanvas = ({ clicks, width = 800, height = 500 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ─── Clear Canvas ───────────────────────────────────
    ctx.clearRect(0, 0, width, height);

    // ─── Draw Background ────────────────────────────────
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    // ─── Draw Grid Lines ────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // ─── Draw Heatmap Dots ──────────────────────────────
    if (clicks && clicks.length > 0) {
      // Count clicks at same position for intensity
      const clickMap = {};
      clicks.forEach((click) => {
        const key = `${Math.round(click.x)}_${Math.round(click.y)}`;
        clickMap[key] = (clickMap[key] || 0) + 1;
      });

      const maxCount = Math.max(...Object.values(clickMap));

      clicks.forEach((click) => {
        const x = click.x;
        const y = click.y;
        const key = `${Math.round(x)}_${Math.round(y)}`;
        const count = clickMap[key];
        const intensity = count / maxCount;

        // Outer glow
        const outerRadius = 20 + intensity * 15;
        const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);

        outerGlow.addColorStop(0, `rgba(255, 100, 50,  ${0.3 * intensity})`);
        outerGlow.addColorStop(0.5, `rgba(255, 200, 50,  ${0.15 * intensity})`);
        outerGlow.addColorStop(1, "rgba(255, 200, 50, 0)");

        ctx.beginPath();
        ctx.fillStyle = outerGlow;
        ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner dot
        const innerRadius = 6 + intensity * 6;
        const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, innerRadius);

        innerGlow.addColorStop(0, `rgba(255, 50,  50,  ${0.9})`);
        innerGlow.addColorStop(0.5, `rgba(255, 150, 50,  ${0.7})`);
        innerGlow.addColorStop(1, `rgba(255, 200, 100, 0)`);

        ctx.beginPath();
        ctx.fillStyle = innerGlow;
        ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ─── Empty State on Canvas ──────────────────────────
    if (!clicks || clicks.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("No click data available", width / 2, height / 2 - 10);
      ctx.font = "14px monospace";
      ctx.fillText(
        "Select a page URL and click Fetch",
        width / 2,
        height / 2 + 20,
      );
    }
  }, [clicks, width, height]);

  return (
    <div style={styles.canvasWrapper}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={styles.canvas}
      />

      {/* Axis Labels */}
      <div style={styles.xLabel}>X Coordinate →</div>
      <div style={styles.yLabel}>Y Coordinate ↓</div>
    </div>
  );
};

const styles = {
  canvasWrapper: {
    position: "relative",
    display: "inline-block",
  },
  canvas: {
    borderRadius: "12px",
    display: "block",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  xLabel: {
    textAlign: "center",
    marginTop: "8px",
    color: "#888",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  yLabel: {
    position: "absolute",
    left: "-30px",
    top: "50%",
    transform: "rotate(-90deg) translateX(-50%)",
    color: "#888",
    fontSize: "13px",
    fontFamily: "monospace",
    whiteSpace: "nowrap",
  },
};

export default HeatmapCanvas;
