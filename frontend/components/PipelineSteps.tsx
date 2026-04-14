"use client";

export default function PipelineSteps({ results }: { results: any }) {
    if (!results) return null;

    const steps = [
        {
            id: "01",
            label: "Code Analysis",
            color: "#00c8ff",
            value: `${results.analysis?.raw_pairs?.length ?? 0} pairs`,
            sub: "duplicates found",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="1" y="3" width="13" height="1.5" rx="0.75" fill="#00c8ff" opacity="0.9" />
                    <rect x="1" y="7" width="9" height="1.5" rx="0.75" fill="#00c8ff" opacity="0.6" />
                    <rect x="3" y="11" width="11" height="1.5" rx="0.75" fill="#00c8ff" opacity="0.9" />
                    <rect x="3" y="15" width="7" height="1.5" rx="0.75" fill="#00c8ff" opacity="0.6" />
                    <circle cx="17" cy="16" r="3.5" stroke="#00c8ff" strokeWidth="1.2" fill="none" />
                    <line x1="19.5" y1="18.5" x2="21" y2="20" stroke="#00c8ff" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            id: "02",
            label: "Abstraction",
            color: "#00ff88",
            value: results.abstraction?.library_name ?? "—",
            sub: "library designed",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4" r="3" stroke="#00ff88" strokeWidth="1.2" fill="rgba(0,255,136,0.1)" />
                    <circle cx="3" cy="16" r="3" stroke="#00ff88" strokeWidth="1.2" fill="rgba(0,255,136,0.1)" />
                    <circle cx="17" cy="16" r="3" stroke="#00ff88" strokeWidth="1.2" fill="rgba(0,255,136,0.1)" />
                    <line x1="10" y1="7" x2="3" y2="13" stroke="#00ff88" strokeWidth="1" opacity="0.5" />
                    <line x1="10" y1="7" x2="17" y2="13" stroke="#00ff88" strokeWidth="1" opacity="0.5" />
                </svg>
            ),
        },
        {
            id: "03",
            label: "Impact",
            color: "#ffaa00",
            value: results.impact?.financial_impact?.annual_savings_usd
                ? `$${Number(results.impact.financial_impact.annual_savings_usd).toLocaleString()}`
                : results.impact?.computed_savings?.annual_usd_saved
                    ? `$${Number(results.impact.computed_savings.annual_usd_saved).toLocaleString()}`
                    : "—",
            sub: "annual savings",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <polyline points="1,16 6,10 10,13 15,5 19,2" stroke="#ffaa00" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="19" cy="2" r="1.5" fill="#ffaa00" />
                </svg>
            ),
        },
        {
            id: "04",
            label: "Migration",
            color: "#9d4edd",
            value: results.migration?.total_estimated_days
                ? `${results.migration.total_estimated_days}d`
                : "—",
            sub: "estimated timeline",
            icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="1" y="4" width="6" height="6" rx="1.5" stroke="#9d4edd" strokeWidth="1.2" fill="rgba(157,78,221,0.1)" />
                    <rect x="13" y="4" width="6" height="6" rx="1.5" stroke="#9d4edd" strokeWidth="1.2" fill="rgba(157,78,221,0.1)" />
                    <rect x="7" y="13" width="6" height="6" rx="1.5" stroke="#9d4edd" strokeWidth="1.2" fill="rgba(157,78,221,0.1)" />
                    <path d="M7 7 L13 7" stroke="#9d4edd" strokeWidth="1" opacity="0.5" />
                    <path d="M10 10 L10 13" stroke="#9d4edd" strokeWidth="1" opacity="0.5" />
                </svg>
            ),
        },
    ];

    return (
        <div style={styles.wrap}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <span style={styles.headerDot} />
                    <span style={styles.headerLabel}>PIPELINE COMPLETED</span>
                </div>
                <span style={styles.headerMeta}>
                    {results.pipeline_duration_seconds ? `${results.pipeline_duration_seconds}s runtime` : ""}
                    {results.repos_analyzed?.length ? ` · ${results.repos_analyzed.length} repos` : ""}
                </span>
            </div>

            <div style={styles.steps}>
                {steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                        <div style={{ ...styles.step, borderColor: `${step.color}20` }}>
                            <div style={styles.stepHeader}>
                                <div style={{ ...styles.stepIcon, background: `${step.color}10` }}>
                                    {step.icon}
                                </div>
                                <div style={{ ...styles.stepNum, color: step.color }}>_{step.id}</div>
                            </div>
                            <div style={{ ...styles.stepValue, color: step.color }}>{step.value}</div>
                            <div style={styles.stepSub}>{step.sub}</div>
                            <div style={styles.stepLabel}>{step.label}</div>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={styles.divider}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M3 2 L9 6 L3 10" stroke="rgba(0,200,255,0.2)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {
        background: "var(--bg-card)",
        border: "1px solid var(--border-dim)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "1.5rem",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.875rem 1.5rem",
        borderBottom: "1px solid var(--border-dim)",
        background: "rgba(0,255,136,0.03)",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    headerDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#00ff88",
        boxShadow: "0 0 8px #00ff88",
        display: "block",
    },
    headerLabel: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.15em",
        color: "#00ff88",
        fontWeight: 600,
    },
    headerMeta: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-muted)",
        letterSpacing: "0.06em",
    },
    steps: {
        display: "flex",
        alignItems: "stretch",
        padding: "1.25rem 1rem",
        gap: "4px",
        overflowX: "auto",
    },
    step: {
        flex: 1,
        padding: "1rem",
        background: "rgba(0,0,0,0.25)",
        border: "1px solid",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minWidth: "120px",
    },
    stepHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "4px",
    },
    stepIcon: {
        width: "34px",
        height: "34px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    stepNum: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.08em",
        opacity: 0.6,
    },
    stepValue: {
        fontFamily: "var(--font-display)",
        fontSize: "1.4rem",
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "-0.02em",
    },
    stepSub: {
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: "var(--text-muted)",
        letterSpacing: "0.06em",
    },
    stepLabel: {
        fontFamily: "var(--font-display)",
        fontSize: "12px",
        fontWeight: 600,
        color: "var(--text-secondary)",
        marginTop: "2px",
    },
    divider: {
        padding: "0 4px",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
    },
};