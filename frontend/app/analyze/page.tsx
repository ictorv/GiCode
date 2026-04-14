"use client";

import { useState } from "react";
import { analyzeLocal } from "../../lib/api";
import ResultViewer from "../../components/ResultViewer";
import Loading from "../../components/Loading";

export default function AnalyzePage() {
    const [codeA, setCodeA] = useState("");
    const [codeB, setCodeB] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = async () => {
        if (!codeA.trim() || !codeB.trim()) {
            setError("Please provide code for both repositories.");
            return;
        }
        try {
            setLoading(true);
            setResults(null);
            setError(null);
            const data = await analyzeLocal({ repoA: codeA, repoB: codeB });
            setResults(data);
        } catch (err: any) {
            setError(err.message ?? "Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    const placeholder = (name: string) =>
        `// ${name} — Paste your code here\n\nfunction fetchUserData(userId) {\n  return db.query('SELECT * FROM users WHERE id = ?', [userId]);\n}\n\nfunction processPayment(amount, currency) {\n  // ...\n}`;

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header} className="animate-slide-up">
                <div style={styles.breadcrumb}>
                    <span style={styles.breadcrumbDim}>CodeMind</span>
                    <span style={styles.sep}>/</span>
                    <span style={styles.breadcrumbActive}>Local Analyzer</span>
                </div>
                <h1 style={styles.title}>Local Code Analyzer</h1>
                <p style={styles.desc}>
                    Paste source code from two repositories directly into the editor panels below.
                    Ideal for quick comparisons without GitHub API access.
                </p>
            </div>

            {/* Editors */}
            <div style={styles.editorsWrap} className="animate-slide-up delay-2">
                {[
                    { key: "A", label: "REPOSITORY A", value: codeA, setter: setCodeA, color: "#00c8ff" },
                    { key: "B", label: "REPOSITORY B", value: codeB, setter: setCodeB, color: "#00ff88" },
                ].map(({ key, label, value, setter, color }) => (
                    <div key={key} style={{ ...styles.editor, borderColor: `${color}15` }}>
                        <div style={{ ...styles.editorHeader, borderColor: `${color}12` }}>
                            <div style={{ ...styles.editorDot, background: color }} />
                            <span style={{ ...styles.editorLabel, color }}>{label}</span>
                            <span style={styles.editorChars}>{value.length} chars</span>
                        </div>
                        <textarea
                            placeholder={placeholder(label)}
                            style={{ ...styles.codeArea, caretColor: color }}
                            rows={14}
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                ))}
            </div>

            {error && (
                <div style={styles.errorBanner} className="animate-slide-up">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="#ff3366" strokeWidth="1" />
                        <line x1="7" y1="4" x2="7" y2="8" stroke="#ff3366" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="7" cy="10" r="0.75" fill="#ff3366" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                onClick={analyze}
                disabled={loading}
                style={{ ...styles.btn, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                className="animate-slide-up delay-3"
            >
                {loading ? (
                    <>
                        <div style={styles.btnSpinner} />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8 L7 12 L13 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Run Analysis Pipeline
                    </>
                )}
            </button>

            {loading && (
                <div className="animate-slide-up">
                    <Loading />
                </div>
            )}

            {results && (
                <div className="animate-slide-up">
                    <ResultViewer results={results} />
                </div>
            )}

        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { display: "flex", flexDirection: "column", gap: "1.75rem", paddingTop: "1rem" },

    header: {},
    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--text-muted)",
        marginBottom: "1.25rem",
    },
    breadcrumbDim: { color: "var(--text-muted)" },
    sep: { color: "rgba(0,200,255,0.2)" },
    breadcrumbActive: { color: "#00ff88" },
    title: {
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-primary)",
        marginBottom: "0.75rem",
    },
    desc: {
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        color: "var(--text-secondary)",
        lineHeight: 1.7,
        maxWidth: "600px",
    },

    editorsWrap: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
    },
    editor: {
        background: "var(--bg-card)",
        border: "1px solid",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    editorHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        borderBottom: "1px solid",
        background: "rgba(0,0,0,0.2)",
    },
    editorDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        flexShrink: 0,
        boxShadow: "0 0 6px currentColor",
    },
    editorLabel: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.15em",
        fontWeight: 600,
        flex: 1,
    },
    editorChars: {
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: "var(--text-muted)",
    },
    codeArea: {
        width: "100%",
        flex: 1,
        padding: "16px",
        background: "rgba(0,0,0,0.3)",
        border: "none",
        color: "#a8d8ea",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        lineHeight: 1.7,
        resize: "vertical",
        outline: "none",
        minHeight: "240px",
    },

    errorBanner: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        background: "rgba(255,51,102,0.08)",
        border: "1px solid rgba(255,51,102,0.2)",
        borderRadius: "10px",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        color: "#ff3366",
    },
    btn: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "13px 28px",
        background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,200,255,0.08))",
        border: "1px solid rgba(0,255,136,0.3)",
        borderRadius: "12px",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        letterSpacing: "0.06em",
        fontWeight: 600,
        alignSelf: "flex-start",
        transition: "all 0.2s",
    },
    btnSpinner: {
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        border: "2px solid rgba(0,255,136,0.3)",
        borderTopColor: "#00ff88",
        animation: "spin-slow 0.8s linear infinite",
    },
};