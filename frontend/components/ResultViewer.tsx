"use client";

import { useState } from "react";

function Section({ title, icon, color = "#00c8ff", children, defaultOpen = true }: any) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ ...sectionStyles.wrap, borderColor: `${color}15` }}>
            <button onClick={() => setOpen(!open)} style={sectionStyles.header}>
                <div style={sectionStyles.headerLeft}>
                    <div style={{ ...sectionStyles.iconWrap, background: `${color}10`, border: `1px solid ${color}25` }}>
                        {icon}
                    </div>
                    <span style={{ ...sectionStyles.title, color: "var(--text-primary)" }}>{title}</span>
                </div>
                <div style={{ ...sectionStyles.chevron, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3 L9 7 L5 11" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </button>
            {open && <div style={sectionStyles.body}>{children}</div>}
        </div>
    );
}

function DataRow({ label, value, accent }: { label: string; value: any; accent?: string }) {
    return (
        <div style={rowStyles.wrap}>
            <span style={rowStyles.label}>{label}</span>
            <span style={{ ...rowStyles.value, color: accent || "var(--text-primary)" }}>{value ?? "—"}</span>
        </div>
    );
}

function Badge({ text, color }: { text: string; color: string }) {
    return (
        <span style={{ ...badgeStyles.badge, color, background: `${color}12`, border: `1px solid ${color}25` }}>
            {text}
        </span>
    );
}

function severityColor(sev: string) {
    if (!sev) return "#7aadcc";
    const s = sev.toLowerCase();
    if (s === "critical" || s === "high") return "#ff3366";
    if (s === "medium") return "#ffaa00";
    return "#00c8ff";
}

function riskColor(r: string) {
    if (!r) return "#7aadcc";
    const l = r.toLowerCase();
    if (l === "high" || l === "critical") return "#ff3366";
    if (l === "medium") return "#ffaa00";
    return "#00ff88";
}

export default function ResultViewer({ results }: { results: any }) {
    const [showRaw, setShowRaw] = useState(false);

    if (!results) return null;

    const pairs = results.analysis?.raw_pairs ?? [];
    const modules = results.abstraction?.modules ?? [];
    const phases = results.migration?.phases ?? [];

    return (
        <div style={styles.wrap}>

            {/* ── Code Analysis ── */}
            <Section
                title="Code Analysis"
                color="#00c8ff"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="2" width="11" height="1.5" rx="0.75" fill="#00c8ff" /><rect x="1" y="6" width="7" height="1.5" rx="0.75" fill="#00c8ff" opacity="0.6" /><rect x="3" y="10" width="9" height="1.5" rx="0.75" fill="#00c8ff" /><rect x="3" y="14" width="5" height="1.5" rx="0.75" fill="#00c8ff" opacity="0.6" /><circle cx="15" cy="14" r="2.5" stroke="#00c8ff" strokeWidth="1" fill="none" /></svg>}
            >
                <div style={styles.grid2}>
                    <DataRow label="Summary" value={results.analysis?.summary} />
                    <DataRow
                        label="Risk Level"
                        value={<Badge text={results.analysis?.risk_level ?? "Unknown"} color={riskColor(results.analysis?.risk_level)} />}
                    />
                    <DataRow label="Total Duplicate Pairs" value={results.analysis?.total_duplicate_pairs ?? pairs.length} accent="#00c8ff" />
                    <DataRow label="Repos Analyzed" value={results.repos_analyzed?.join(", ")} />
                </div>

                {pairs.length > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <div style={styles.subheader}>
                            <div style={styles.subheaderDot} />
                            DUPLICATE FUNCTION PAIRS
                        </div>
                        <div style={styles.pairGrid}>
                            {pairs.map((p: any, i: number) => (
                                <div key={i} style={{ ...styles.pairCard, borderLeftColor: severityColor(p.severity) }}>
                                    <div style={styles.pairHeader}>
                                        <Badge text={`PAIR ${String(i + 1).padStart(2, "0")}`} color="#00c8ff" />
                                        <Badge text={p.severity?.toUpperCase() ?? "UNKNOWN"} color={severityColor(p.severity)} />
                                        <span style={styles.pairSimilarity}>{typeof p.similarity_score === "number" ? `${(p.similarity_score * 100).toFixed(0)}%` : p.similarity_score}</span>
                                    </div>
                                    <div style={styles.pairRepos}>
                                        <div style={styles.pairRepo}>
                                            <span style={styles.pairRepoLabel}>REPO A</span>
                                            <span style={styles.pairRepoName}>{p.fn_a?.repo}</span>
                                            {p.fn_a?.name && <span style={styles.pairFn}>{p.fn_a.name}()</span>}
                                        </div>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, margin: "0 8px" }}>
                                            <path d="M4 10 L16 10 M12 6 L16 10 L12 14" stroke="rgba(0,200,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div style={styles.pairRepo}>
                                            <span style={styles.pairRepoLabel}>REPO B</span>
                                            <span style={styles.pairRepoName}>{p.fn_b?.repo}</span>
                                            {p.fn_b?.name && <span style={styles.pairFn}>{p.fn_b.name}()</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {pairs.length === 0 && (
                    <div style={styles.empty}>No duplicate functions detected.</div>
                )}
            </Section>

            {/* ── Abstraction ── */}
            <Section
                title="Suggested Shared Library"
                color="#00ff88"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="3.5" r="2.5" stroke="#00ff88" strokeWidth="1.2" fill="rgba(0,255,136,0.1)" /><circle cx="3" cy="14.5" r="2.5" stroke="#00ff88" strokeWidth="1.2" fill="rgba(0,255,136,0.1)" /><circle cx="15" cy="14.5" r="2.5" stroke="#00ff88" strokeWidth="1.2" fill="rgba(0,255,136,0.1)" /><line x1="9" y1="6" x2="3" y2="12" stroke="#00ff88" strokeWidth="0.8" opacity="0.5" /><line x1="9" y1="6" x2="15" y2="12" stroke="#00ff88" strokeWidth="0.8" opacity="0.5" /></svg>}
            >
                <div style={styles.libraryHeader}>
                    <div style={styles.libraryName}>{results.abstraction?.library_name ?? "—"}</div>
                    <Badge text={`v${results.abstraction?.version ?? "0.0.1"}`} color="#00ff88" />
                </div>
                <p style={styles.libraryDesc}>{results.abstraction?.description}</p>

                {modules.length > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <div style={styles.subheader}>
                            <div style={{ ...styles.subheaderDot, background: "#00ff88" }} />
                            MODULES ({modules.length})
                        </div>
                        <div style={styles.modulesGrid}>
                            {modules.map((m: any, i: number) => (
                                <div key={i} style={styles.moduleCard}>
                                    <div style={styles.moduleTop}>
                                        <span style={styles.moduleName}>{m.module_name}</span>
                                    </div>
                                    <p style={styles.modulePurpose}>{m.purpose}</p>
                                    {m.interfaces?.length > 0 && (
                                        <div style={styles.interfaces}>
                                            <div style={styles.interfacesLabel}>INTERFACES</div>
                                            {m.interfaces.map((iface: any, j: number) => (
                                                <div key={j} style={styles.iface}>
                                                    <code style={styles.ifaceCode}>{iface.signature}</code>
                                                    <p style={styles.ifaceDesc}>{iface.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            {/* ── Impact ── */}
            <Section
                title="Impact Assessment"
                color="#ffaa00"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="1,14 5,9 9,12 13,5 17,2" stroke="#ffaa00" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17" cy="2" r="1.5" fill="#ffaa00" /></svg>}
            >
                <p style={styles.execSummary}>{results.impact?.executive_summary}</p>

                <div style={styles.impactMetrics}>
                    {[
                        {
                            label: "Annual Savings",
                            value: results.impact?.financial_impact?.annual_savings_usd != null
                                ? `$${Number(results.impact.financial_impact.annual_savings_usd).toLocaleString()}`
                                : results.impact?.computed_savings?.annual_usd_saved != null
                                    ? `$${Number(results.impact.computed_savings.annual_usd_saved).toLocaleString()}`
                                    : "—",
                            color: "#ffaa00",
                        },
                        {
                            label: "Monthly Hours Saved",
                            value: results.impact?.financial_impact?.monthly_hours_saved
                                ?? results.impact?.computed_savings?.monthly_hours_saved
                                ?? "—",
                            color: "#00ff88",
                        },
                        {
                            label: "Lines Eliminated",
                            value: results.impact?.financial_impact?.lines_eliminated
                                ?? results.impact?.computed_savings?.lines_eliminated
                                ?? "—",
                            color: "#00c8ff",
                        },
                        {
                            label: "Priority",
                            value: results.impact?.priority ?? "—",
                            color: "#9d4edd",
                        },
                    ].map((m, i) => (
                        <div key={i} style={{ ...styles.metricCard, borderColor: `${m.color}20` }}>
                            <div style={{ ...styles.metricValue, color: m.color }}>{m.value}</div>
                            <div style={styles.metricLabel}>{m.label}</div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Migration ── */}
            <Section
                title="Migration Plan"
                color="#9d4edd"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="2" width="6" height="6" rx="1.5" stroke="#9d4edd" strokeWidth="1.2" fill="rgba(157,78,221,0.1)" /><rect x="11" y="2" width="6" height="6" rx="1.5" stroke="#9d4edd" strokeWidth="1.2" fill="rgba(157,78,221,0.1)" /><rect x="6" y="12" width="6" height="6" rx="1.5" stroke="#9d4edd" strokeWidth="1.2" fill="rgba(157,78,221,0.1)" /><path d="M7 5 L11 5" stroke="#9d4edd" strokeWidth="0.8" opacity="0.5" /><path d="M9 8 L9 12" stroke="#9d4edd" strokeWidth="0.8" opacity="0.5" /></svg>}
            >
                <div style={styles.migrationHeader}>
                    <div style={styles.migrationTotal}>
                        <span style={styles.migrationTotalNum}>{results.migration?.total_estimated_days ?? "—"}</span>
                        <span style={styles.migrationTotalLabel}>Total Days</span>
                    </div>
                </div>

                {phases.length > 0 && (
                    <div style={styles.phases}>
                        {phases.map((phase: any, i: number) => (
                            <div key={i} style={styles.phase}>
                                <div style={styles.phaseAside}>
                                    <div style={styles.phaseNumBadge}>P{phase.phase_number ?? i + 1}</div>
                                    {i < phases.length - 1 && <div style={styles.phaseLine} />}
                                </div>
                                <div style={styles.phaseContent}>
                                    <div style={styles.phaseTop}>
                                        <span style={styles.phaseName}>{phase.name}</span>
                                        <Badge text={`${phase.estimated_days}d`} color="#9d4edd" />
                                    </div>
                                    <p style={styles.phaseDesc}>{phase.description}</p>
                                    {phase.tasks?.length > 0 && (
                                        <ul style={styles.taskList}>
                                            {phase.tasks.map((t: string, j: number) => (
                                                <li key={j} style={styles.taskItem}>
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                                                        <path d="M2 5 L4 7 L8 3" stroke="#9d4edd" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* ── Raw Output ── */}
            <div style={styles.rawWrap}>
                <button onClick={() => setShowRaw(!showRaw)} style={styles.rawToggle}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1" />
                        <path d="M4 7 L2 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        <path d="M5 9 L4 7 L5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 5 L9 7 L8 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 7 L12 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {showRaw ? "Hide" : "Show"} Raw JSON Output
                    <div style={{ ...styles.rawChevron, transform: showRaw ? "rotate(90deg)" : "rotate(0deg)" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M3 2 L7 5 L3 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
                {showRaw && (
                    <div style={styles.rawBody}>
                        <pre style={styles.rawPre}>{JSON.stringify(results, null, 2)}</pre>
                    </div>
                )}
            </div>

        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem 2rem" },
    subheader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.18em",
        color: "var(--text-muted)",
        marginBottom: "0.75rem",
    },
    subheaderDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#00c8ff",
        flexShrink: 0,
    },
    pairGrid: { display: "flex", flexDirection: "column", gap: "0.75rem" },
    pairCard: {
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(0,200,255,0.08)",
        borderLeft: "3px solid",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
    },
    pairHeader: { display: "flex", alignItems: "center", gap: "8px" },
    pairSimilarity: {
        fontFamily: "var(--font-display)",
        fontSize: "1.1rem",
        fontWeight: 800,
        color: "var(--text-primary)",
        marginLeft: "auto",
    },
    pairRepos: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    pairRepo: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "3px",
    },
    pairRepoLabel: {
        fontFamily: "var(--font-mono)",
        fontSize: "8px",
        letterSpacing: "0.15em",
        color: "var(--text-muted)",
    },
    pairRepoName: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--text-secondary)",
    },
    pairFn: {
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--accent-cyan)",
    },
    empty: {
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        color: "var(--text-muted)",
        textAlign: "center",
        padding: "2rem",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "10px",
        marginTop: "1rem",
    },
    libraryHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "0.5rem",
    },
    libraryName: {
        fontFamily: "var(--font-mono)",
        fontSize: "1.2rem",
        fontWeight: 600,
        color: "#00ff88",
    },
    libraryDesc: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--text-secondary)",
        lineHeight: 1.65,
    },
    modulesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" },
    moduleCard: {
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(0,255,136,0.1)",
        borderRadius: "12px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    moduleTop: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    moduleName: {
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        fontWeight: 600,
        color: "#00ff88",
    },
    modulePurpose: {
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
    },
    interfaces: {
        marginTop: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    interfacesLabel: {
        fontFamily: "var(--font-mono)",
        fontSize: "8px",
        letterSpacing: "0.15em",
        color: "var(--text-muted)",
        marginBottom: "4px",
    },
    iface: {
        padding: "8px 10px",
        background: "rgba(0,255,136,0.04)",
        border: "1px solid rgba(0,255,136,0.08)",
        borderRadius: "6px",
    },
    ifaceCode: {
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "#00ff88",
        display: "block",
        marginBottom: "3px",
    },
    ifaceDesc: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-muted)",
        lineHeight: 1.5,
    },

    execSummary: {
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        color: "var(--text-secondary)",
        lineHeight: 1.7,
        marginBottom: "1.5rem",
    },
    impactMetrics: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "0.75rem",
    },
    metricCard: {
        padding: "1.25rem",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    metricValue: {
        fontFamily: "var(--font-display)",
        fontSize: "1.75rem",
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "-0.02em",
    },
    metricLabel: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-muted)",
        letterSpacing: "0.08em",
    },

    migrationHeader: { marginBottom: "1.5rem" },
    migrationTotal: { display: "flex", alignItems: "baseline", gap: "8px" },
    migrationTotalNum: {
        fontFamily: "var(--font-display)",
        fontSize: "3rem",
        fontWeight: 800,
        color: "#9d4edd",
        lineHeight: 1,
    },
    migrationTotalLabel: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--text-muted)",
        letterSpacing: "0.08em",
    },
    phases: { display: "flex", flexDirection: "column", gap: 0 },
    phase: { display: "flex", gap: "1.25rem", paddingBottom: "1.5rem" },
    phaseAside: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        width: "36px",
    },
    phaseNumBadge: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: "rgba(157,78,221,0.12)",
        border: "1px solid rgba(157,78,221,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 600,
        color: "#9d4edd",
        flexShrink: 0,
    },
    phaseLine: {
        flex: 1,
        width: "1px",
        background: "rgba(157,78,221,0.15)",
        margin: "6px 0",
        minHeight: "20px",
    },
    phaseContent: { flex: 1, paddingBottom: "0.5rem" },
    phaseTop: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "0.5rem",
    },
    phaseName: {
        fontFamily: "var(--font-display)",
        fontSize: "15px",
        fontWeight: 700,
        color: "var(--text-primary)",
        flex: 1,
    },
    phaseDesc: {
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        marginBottom: "0.75rem",
    },
    taskList: { display: "flex", flexDirection: "column", gap: "6px", listStyle: "none" },
    taskItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "var(--text-secondary)",
        lineHeight: 1.5,
    },

    rawWrap: {
        background: "var(--bg-card)",
        border: "1px solid var(--border-dim)",
        borderRadius: "14px",
        overflow: "hidden",
    },
    rawToggle: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "1rem 1.25rem",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        letterSpacing: "0.06em",
        color: "var(--text-secondary)",
        textAlign: "left",
        transition: "color 0.2s",
    },
    rawChevron: { marginLeft: "auto", transition: "transform 0.2s" },
    rawBody: {
        borderTop: "1px solid var(--border-dim)",
        padding: "1.25rem",
        background: "rgba(0,0,0,0.3)",
    },
    rawPre: {
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "#00ff88",
        lineHeight: 1.6,
        overflowX: "auto",
    },
};

const sectionStyles: Record<string, React.CSSProperties> = {
    wrap: {
        background: "var(--bg-card)",
        border: "1px solid",
        borderRadius: "16px",
        overflow: "hidden",
    },
    header: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.5rem",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        gap: "1rem",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    iconWrap: {
        width: "36px",
        height: "36px",
        borderRadius: "9px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    title: {
        fontFamily: "var(--font-display)",
        fontSize: "16px",
        fontWeight: 700,
    },
    chevron: {
        flexShrink: 0,
        transition: "transform 0.2s",
    },
    body: {
        padding: "0 1.5rem 1.5rem",
        borderTop: "1px solid rgba(0,200,255,0.05)",
        paddingTop: "1.25rem",
    },
};

const rowStyles: Record<string, React.CSSProperties> = {
    wrap: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "0.75rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
    },
    label: {
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.14em",
        color: "var(--text-muted)",
        textTransform: "uppercase",
    },
    value: {
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        lineHeight: 1.4,
    },
};

const badgeStyles: Record<string, React.CSSProperties> = {
    badge: {
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.12em",
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: "100px",
        display: "inline-block",
    },
};