"use client";

import { useState } from "react";
import { analyzeGithub } from "../../lib/api";
import ResultViewer from "../../components/ResultViewer";
import PipelineSteps from "../../components/PipelineSteps";
import Loading from "../../components/Loading";

export default function GithubPage() {
    const [repos, setRepos] = useState("");
    const [token, setToken] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = async () => {
        if (!repos.trim()) {
            setError("Please enter at least one repository.");
            return;
        }
        try {
            setLoading(true);
            setResults(null);
            setError(null);
            const repoList = repos.split("\n").map((r) => r.trim()).filter(Boolean);
            const data = await analyzeGithub(repoList, token);
            setResults(data);
        } catch (err: any) {
            setError(err.message ?? "Analysis failed. Check console.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            {/* Page header */}
            <div style={styles.pageHeader} className="animate-slide-up">
                <div style={styles.breadcrumb}>
                    <span style={styles.breadcrumbItem}>CodeMind</span>
                    <span style={styles.breadcrumbSep}>/</span>
                    <span style={styles.breadcrumbActive}>GitHub Analyzer</span>
                </div>
                <h1 style={styles.title}>GitHub Repository Analyzer</h1>
                <p style={styles.desc}>
                    Provide GitHub repository slugs to run the full multi-agent analysis pipeline.
                    The system will clone, scan, detect duplicates, and generate a complete migration strategy.
                </p>
            </div>

            {/* Input panel */}
            <div style={styles.inputPanel} className="animate-slide-up delay-2">

                <div style={styles.inputGroup}>
                    <label style={styles.label}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1 C3.2 1 1 3.2 1 6 C1 8.2 2.5 10.1 4.5 10.8 C4.8 10.8 4.9 10.7 4.9 10.5 L4.9 9.6 C3.3 10 3 8.9 3 8.9 C2.7 8.2 2.3 8 2.3 8 C1.7 7.6 2.3 7.6 2.3 7.6 C2.9 7.6 3.3 8.2 3.3 8.2 C3.9 9.2 4.9 8.9 5.2 8.7 C5.3 8.3 5.5 8 5.7 7.9 C4.2 7.7 2.6 7.1 2.6 4.6 C2.6 3.9 2.8 3.3 3.3 2.8 C3.2 2.6 3 2 3.3 1.1 C3.3 1.1 3.9 0.9 5.1 1.7 C5.6 1.6 6.2 1.5 6.7 1.5 C7.2 1.5 7.8 1.6 8.3 1.7 C9.5 0.9 10.1 1.1 10.1 1.1 C10.4 2 10.2 2.6 10.1 2.8 C10.6 3.3 10.8 3.9 10.8 4.6 C10.8 7.1 9.2 7.7 7.7 7.9 C7.9 8.1 8.1 8.5 8.1 9.1 L8.1 10.5 C8.1 10.7 8.2 10.9 8.5 10.8 C10.5 10.1 12 8.2 12 6 C11 3.2 8.8 1 6 1Z" fill="var(--accent-cyan)" />
                        </svg>
                        REPOSITORIES
                    </label>
                    <textarea
                        placeholder={"owner/repo1\nowner/repo2\nowner/repo3"}
                        style={styles.textarea}
                        rows={5}
                        onChange={(e) => setRepos(e.target.value)}
                        value={repos}
                    />
                    <div style={styles.inputHint}>One repository per line (format: owner/repo)</div>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="5" width="10" height="7" rx="1.5" stroke="var(--accent-cyan)" strokeWidth="1" fill="none" />
                            <path d="M3.5 5 L3.5 3.5 C3.5 2.1 4.3 1 6 1 C7.7 1 8.5 2.1 8.5 3.5 L8.5 5" stroke="var(--accent-cyan)" strokeWidth="1" fill="none" />
                            <circle cx="6" cy="8.5" r="1" fill="var(--accent-cyan)" />
                        </svg>
                        GITHUB TOKEN
                        <span style={styles.optionalTag}>OPTIONAL</span>
                    </label>
                    <input
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        style={styles.input}
                        onChange={(e) => setToken(e.target.value)}
                        value={token}
                    />
                    <div style={styles.inputHint}>Required for private repos. Increases rate limits for public repos.</div>
                </div>

                {error && (
                    <div style={styles.errorBanner}>
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
                    style={{ ...styles.runBtn, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? (
                        <>
                            <div style={styles.btnSpinner} />
                            Pipeline Running...
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <polygon points="4,2 14,8 4,14" fill="white" opacity="0.9" />
                            </svg>
                            Execute Analysis Pipeline
                        </>
                    )}
                </button>

            </div>

            {/* Loading */}
            {loading && (
                <div className="animate-slide-up">
                    <Loading />
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="animate-slide-up">
                    <PipelineSteps results={results} />
                    <ResultViewer results={results} />
                </div>
            )}

        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { display: "flex", flexDirection: "column", gap: "2rem", paddingTop: "1rem" },

    pageHeader: {},
    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--text-muted)",
        marginBottom: "1.25rem",
    },
    breadcrumbItem: { color: "var(--text-muted)" },
    breadcrumbSep: { color: "rgba(0,200,255,0.2)" },
    breadcrumbActive: { color: "var(--accent-cyan)" },

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

    inputPanel: {
        background: "var(--bg-card)",
        border: "1px solid var(--border-dim)",
        borderRadius: "20px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.15em",
        color: "var(--accent-cyan)",
        fontWeight: 600,
    },
    optionalTag: {
        fontFamily: "var(--font-mono)",
        fontSize: "8px",
        letterSpacing: "0.1em",
        color: "var(--text-muted)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "100px",
        padding: "1px 7px",
        marginLeft: "4px",
    },
    textarea: {
        width: "100%",
        padding: "14px 16px",
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(0,200,255,0.12)",
        borderRadius: "12px",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        lineHeight: 1.7,
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.2s",
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(0,200,255,0.12)",
        borderRadius: "12px",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        outline: "none",
        transition: "border-color 0.2s",
    },
    inputHint: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-muted)",
        letterSpacing: "0.04em",
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
    runBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "14px 28px",
        background: "linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,255,136,0.1))",
        border: "1px solid rgba(0,200,255,0.3)",
        borderRadius: "12px",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        letterSpacing: "0.06em",
        fontWeight: 600,
        transition: "all 0.2s",
        alignSelf: "flex-start",
    },
    btnSpinner: {
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        border: "2px solid rgba(0,200,255,0.3)",
        borderTopColor: "var(--accent-cyan)",
        animation: "spin-slow 0.8s linear infinite",
    },
};