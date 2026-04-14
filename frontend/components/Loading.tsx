"use client";

const agents = [
    { id: "01", label: "Code Analysis", color: "#00c8ff" },
    { id: "02", label: "Abstraction", color: "#00ff88" },
    { id: "03", label: "Impact Assessment", color: "#ffaa00" },
    { id: "04", label: "Migration Planning", color: "#9d4edd" },
];

export default function Loading({ currentStep = 0 }: { currentStep?: number }) {
    return (
        <div style={styles.wrap}>

            {/* Animated hex spinner */}
            <div style={styles.spinnerWrap}>
                <div style={styles.ring1} />
                <div style={styles.ring2} />
                <div style={styles.ring3} />
                <div style={styles.spinnerCore}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: "spin-slow 4s linear infinite" }}>
                        <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="#00c8ff" strokeWidth="1.2" fill="none" />
                        <circle cx="12" cy="12" r="3" fill="#00c8ff" />
                    </svg>
                </div>
            </div>

            <div style={styles.title}>Executing Agent Pipeline</div>
            <div style={styles.subtitle}>Autonomous multi-agent processing in progress</div>

            {/* Agent progress list */}
            <div style={styles.agentList}>
                {agents.map((agent, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    return (
                        <div key={i} style={styles.agentRow}>
                            <div style={{
                                ...styles.agentIndicator,
                                background: done ? `${agent.color}20` : active ? `${agent.color}12` : "rgba(255,255,255,0.03)",
                                border: `1px solid ${done || active ? agent.color + "40" : "rgba(255,255,255,0.06)"}`,
                            }}>
                                {done ? (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6 L5 9 L10 3" stroke={agent.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : active ? (
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: agent.color, animation: "pulse-glow 1s ease-in-out infinite" }} />
                                ) : (
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                                )}
                            </div>

                            <div style={styles.agentRowLabel}>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "10px",
                                    letterSpacing: "0.1em",
                                    color: active ? agent.color : done ? "#7aadcc" : "var(--text-muted)",
                                    fontWeight: active ? 600 : 400,
                                }}>AGENT_{agent.id}</span>
                                <span style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: active ? "var(--text-primary)" : done ? "var(--text-secondary)" : "var(--text-muted)",
                                }}>{agent.label}</span>
                            </div>

                            {active && (
                                <div style={styles.activeTag}>
                                    <span style={{ ...styles.activeTagDot, background: agent.color }} />
                                    <span style={{ ...styles.activeTagText, color: agent.color }}>RUNNING</span>
                                </div>
                            )}
                            {done && (
                                <div style={{ ...styles.activeTag, background: `${agent.color}08`, borderColor: `${agent.color}20` }}>
                                    <span style={{ ...styles.activeTagText, color: agent.color }}>DONE</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div style={styles.progressWrap}>
                <div style={styles.progressTrack}>
                    <div style={{
                        ...styles.progressFill,
                        animation: "progress-sweep 8s ease-out forwards",
                    }} />
                    <div style={styles.progressGlow} />
                </div>
                <div style={styles.progressLabels}>
                    <span style={styles.progressText}>Processing...</span>
                    <span style={styles.progressText}>May take 1–3 minutes</span>
                </div>
            </div>

        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 2rem",
        background: "var(--bg-card)",
        border: "1px solid var(--border-dim)",
        borderRadius: "20px",
        gap: "1.25rem",
        position: "relative",
        overflow: "hidden",
    },
    spinnerWrap: {
        position: "relative",
        width: "90px",
        height: "90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    ring1: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "1px solid rgba(0,200,255,0.3)",
        animation: "spin-slow 3s linear infinite",
        borderTopColor: "var(--accent-cyan)",
    },
    ring2: {
        position: "absolute",
        inset: "10px",
        borderRadius: "50%",
        border: "1px solid rgba(0,255,136,0.2)",
        animation: "counter-spin 4s linear infinite",
        borderBottomColor: "var(--accent-green)",
    },
    ring3: {
        position: "absolute",
        inset: "20px",
        borderRadius: "50%",
        border: "1px solid rgba(157,78,221,0.15)",
        animation: "spin-slow 6s linear infinite",
        borderLeftColor: "var(--accent-purple)",
    },
    spinnerCore: {
        position: "relative",
        zIndex: 1,
    },
    title: {
        fontFamily: "var(--font-display)",
        fontSize: "1.4rem",
        fontWeight: 700,
        color: "var(--text-primary)",
    },
    subtitle: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--text-secondary)",
        letterSpacing: "0.04em",
    },
    agentList: {
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginTop: "0.5rem",
    },
    agentRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.04)",
    },
    agentIndicator: {
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    agentRowLabel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    activeTag: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: "rgba(0,200,255,0.08)",
        border: "1px solid rgba(0,200,255,0.2)",
        borderRadius: "100px",
        padding: "3px 10px",
        flexShrink: 0,
    },
    activeTagDot: {
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        animation: "pulse-glow 1s ease-in-out infinite",
        display: "block",
    },
    activeTagText: {
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.12em",
        fontWeight: 600,
    },
    progressWrap: {
        width: "100%",
        maxWidth: "400px",
    },
    progressTrack: {
        position: "relative",
        height: "3px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "2px",
        overflow: "visible",
        marginBottom: "8px",
    },
    progressFill: {
        height: "100%",
        background: "linear-gradient(90deg, #00c8ff, #00ff88)",
        borderRadius: "2px",
        width: 0,
    },
    progressGlow: {
        position: "absolute",
        top: "-2px",
        right: 0,
        width: "20px",
        height: "7px",
        background: "rgba(0,200,255,0.6)",
        borderRadius: "50%",
        filter: "blur(4px)",
    },
    progressLabels: {
        display: "flex",
        justifyContent: "space-between",
    },
    progressText: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-muted)",
        letterSpacing: "0.06em",
    },
};