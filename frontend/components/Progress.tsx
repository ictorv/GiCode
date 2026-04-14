"use client";

export default function Progress({ loading }: { loading: boolean }) {
    if (!loading) return null;

    return (
        <div style={styles.wrap}>
            <div style={styles.label}>
                <div style={styles.dot} />
                <span style={styles.text}>Scanning repositories...</span>
            </div>
            <div style={styles.track}>
                <div style={styles.fill} />
                <div style={styles.glow} />
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "1rem 1.25rem",
        background: "rgba(0,200,255,0.04)",
        border: "1px solid rgba(0,200,255,0.1)",
        borderRadius: "12px",
    },
    label: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    dot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "var(--accent-cyan)",
        boxShadow: "0 0 8px var(--accent-cyan)",
        animation: "pulse-glow 1.5s ease-in-out infinite",
    },
    text: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--accent-cyan)",
        letterSpacing: "0.06em",
    },
    track: {
        position: "relative",
        height: "3px",
        background: "rgba(0,200,255,0.08)",
        borderRadius: "2px",
        overflow: "visible",
    },
    fill: {
        height: "100%",
        background: "linear-gradient(90deg, #00c8ff, #00ff88)",
        borderRadius: "2px",
        animation: "progress-sweep 6s ease-out forwards",
        width: 0,
    },
    glow: {
        position: "absolute" as const,
        top: "-3px",
        right: 0,
        width: "24px",
        height: "9px",
        background: "rgba(0,200,255,0.5)",
        borderRadius: "50%",
        filter: "blur(5px)",
    },
};