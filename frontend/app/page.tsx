export default function Home() {
  const agents = [
    {
      id: "01",
      name: "Code Analysis",
      role: "DETECTION AGENT",
      desc: "Scans function-level ASTs across repositories to identify semantic duplicates and structural similarities.",
      color: "#00c8ff",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="4" width="18" height="2" rx="1" fill="#00c8ff" opacity="0.9" />
          <rect x="2" y="9" width="12" height="2" rx="1" fill="#00c8ff" opacity="0.6" />
          <rect x="5" y="14" width="15" height="2" rx="1" fill="#00c8ff" opacity="0.9" />
          <rect x="5" y="19" width="9" height="2" rx="1" fill="#00c8ff" opacity="0.6" />
          <circle cx="22" cy="22" r="5" stroke="#00c8ff" strokeWidth="1.5" fill="none" />
          <line x1="25.5" y1="25.5" x2="28" y2="28" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "02",
      name: "Abstraction",
      role: "SYNTHESIS AGENT",
      desc: "Designs shared library architecture from detected patterns, generating typed interfaces and module boundaries.",
      color: "#00ff88",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="7" r="4" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0,255,136,0.1)" />
          <circle cx="5" cy="22" r="4" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0,255,136,0.1)" />
          <circle cx="23" cy="22" r="4" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0,255,136,0.1)" />
          <line x1="14" y1="11" x2="5" y2="18" stroke="#00ff88" strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="11" x2="23" y2="18" stroke="#00ff88" strokeWidth="1" opacity="0.5" />
        </svg>
      ),
    },
    {
      id: "03",
      name: "Impact Assessment",
      role: "ANALYSIS AGENT",
      desc: "Calculates ROI, developer-hours saved, and risk-adjusted financial projections from refactoring initiatives.",
      color: "#ffaa00",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polyline points="2,22 8,14 13,18 19,8 26,4" stroke="#ffaa00" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="4" r="2" fill="#ffaa00" />
        </svg>
      ),
    },
    {
      id: "04",
      name: "Migration Planning",
      role: "ORCHESTRATION AGENT",
      desc: "Generates phased migration roadmaps with task breakdowns, dependency graphs, and risk mitigation strategies.",
      color: "#9d4edd",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="6" width="8" height="8" rx="2" stroke="#9d4edd" strokeWidth="1.5" fill="rgba(157,78,221,0.1)" />
          <rect x="18" y="6" width="8" height="8" rx="2" stroke="#9d4edd" strokeWidth="1.5" fill="rgba(157,78,221,0.1)" />
          <rect x="10" y="18" width="8" height="8" rx="2" stroke="#9d4edd" strokeWidth="1.5" fill="rgba(157,78,221,0.1)" />
          <path d="M10 10 L18 10" stroke="#9d4edd" strokeWidth="1" opacity="0.6" />
          <path d="M14 14 L14 18" stroke="#9d4edd" strokeWidth="1" opacity="0.6" />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: "4", label: "AI Agents" },
    { value: "∞", label: "Repos Supported" },
    { value: "98%", label: "Detection Accuracy" },
    { value: "<3m", label: "Avg. Runtime" },
  ];

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero} className="animate-slide-up">
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeDot} />
          AUTONOMOUS PIPELINE
        </div>

        <h1 style={styles.heroTitle}>
          Multi-Agent<br />
          <span style={styles.heroTitleAccent}>Code Intelligence</span>
        </h1>

        <p style={styles.heroDesc}>
          An orchestrated AI pipeline that autonomously detects duplicate code across repositories,
          designs shared libraries, assesses financial impact, and generates migration roadmaps —
          end-to-end without human intervention.
        </p>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {stats.map((s, i) => (
            <div key={i} style={styles.statItem}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline visualization */}
      <div style={styles.pipelineRow}>
        {agents.map((agent, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div
              style={{ ...styles.pipelineNode, borderColor: `${agent.color}33` }}
              className={`animate-slide-up delay-${i + 2}`}
            >
              <div style={{ ...styles.nodeNum, color: agent.color }}>{agent.id}</div>
              <div style={{ ...styles.nodeIcon, background: `${agent.color}10` }}>
                {agent.icon}
              </div>
              <div style={styles.nodeLabel}>{agent.name}</div>
              <div style={{ ...styles.nodeRole, color: agent.color }}>{agent.role}</div>
            </div>
            {i < agents.length - 1 && (
              <div style={styles.pipelineArrow}>
                <div style={styles.arrowLine} />
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M0 0 L8 6 L0 12" stroke="rgba(0,200,255,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div style={styles.agentsGrid}>
        {agents.map((agent, i) => (
          <div
            key={i}
            style={{ ...styles.agentCard, borderColor: `${agent.color}18` }}
            className={`animate-slide-up delay-${i + 2}`}
          >
            <div style={styles.agentCardTop}>
              <div style={{ ...styles.agentIcon, background: `${agent.color}10`, border: `1px solid ${agent.color}25` }}>
                {agent.icon}
              </div>
              <div>
                <div style={{ ...styles.agentRole, color: agent.color }}>{agent.role}</div>
                <div style={styles.agentName}>{agent.name}</div>
              </div>
            </div>
            <p style={styles.agentDesc}>{agent.desc}</p>
            <div style={{ ...styles.agentFooter, borderColor: `${agent.color}12` }}>
              <span style={{ ...styles.agentStatus, color: agent.color }}>● ACTIVE</span>
              <span style={styles.agentId}>AGENT_{agent.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture note */}
      <div style={styles.archNote} className="animate-slide-up delay-5">
        <div style={styles.archNoteHeader}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="var(--accent-cyan)" strokeWidth="1" />
            <line x1="7" y1="5" x2="7" y2="9" stroke="var(--accent-cyan)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="3.5" r="0.7" fill="var(--accent-cyan)" />
          </svg>
          PIPELINE ARCHITECTURE
        </div>
        <p style={styles.archNoteText}>
          Each agent runs as an independent LLM call with structured outputs. The orchestrator passes context between agents,
          building a complete analysis graph from raw repository data to actionable migration plan.
          Results are streamed progressively as each agent completes its stage.
        </p>
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { paddingTop: "1rem" },

  hero: {
    marginBottom: "3rem",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.18em",
    color: "var(--accent-cyan)",
    background: "rgba(0,200,255,0.07)",
    border: "1px solid rgba(0,200,255,0.18)",
    borderRadius: "100px",
    padding: "5px 14px",
    marginBottom: "1.5rem",
  },
  heroBadgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent-cyan)",
    boxShadow: "0 0 8px var(--accent-cyan)",
    display: "block",
    animation: "pulse-glow 2s ease-in-out infinite",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
    marginBottom: "1.25rem",
  },
  heroTitleAccent: {
    background: "linear-gradient(135deg, #00c8ff 0%, #00ff88 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroDesc: {
    maxWidth: "600px",
    color: "var(--text-secondary)",
    fontSize: "15px",
    lineHeight: 1.7,
    fontFamily: "var(--font-mono)",
    marginBottom: "2.5rem",
  },
  statsRow: {
    display: "flex",
    gap: "2.5rem",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statValue: {
    fontFamily: "var(--font-display)",
    fontSize: "2rem",
    fontWeight: 800,
    color: "var(--accent-cyan)",
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: "var(--text-muted)",
    textTransform: "uppercase",
  },

  pipelineRow: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    marginBottom: "3rem",
    background: "var(--bg-card)",
    border: "1px solid var(--border-dim)",
    borderRadius: "16px",
    padding: "1.5rem",
    overflow: "auto",
  },
  pipelineNode: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "1rem 0.5rem",
    border: "1px solid",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.3)",
    minWidth: "120px",
  },
  nodeNum: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.1em",
    fontWeight: 600,
    opacity: 0.7,
  },
  nodeIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nodeLabel: {
    fontFamily: "var(--font-display)",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    textAlign: "center",
  },
  nodeRole: {
    fontFamily: "var(--font-mono)",
    fontSize: "8px",
    letterSpacing: "0.12em",
    textAlign: "center",
  },
  pipelineArrow: {
    display: "flex",
    alignItems: "center",
    padding: "0 6px",
    flexShrink: 0,
  },
  arrowLine: {
    width: "20px",
    height: "1px",
    background: "linear-gradient(90deg, rgba(0,200,255,0.1), rgba(0,200,255,0.3))",
  },

  agentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  agentCard: {
    background: "var(--bg-card)",
    border: "1px solid",
    borderRadius: "14px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    transition: "background 0.2s",
  },
  agentCardTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },
  agentIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  agentRole: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    letterSpacing: "0.15em",
    marginBottom: "4px",
  },
  agentName: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  agentDesc: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: 1.65,
    flex: 1,
  },
  agentFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "0.75rem",
    borderTop: "1px solid",
  },
  agentStatus: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    letterSpacing: "0.12em",
    fontWeight: 600,
  },
  agentId: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    color: "var(--text-muted)",
    letterSpacing: "0.08em",
  },

  archNote: {
    background: "rgba(0,200,255,0.04)",
    border: "1px solid rgba(0,200,255,0.1)",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    marginBottom: "2rem",
  },
  archNoteHeader: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "0.15em",
    color: "var(--accent-cyan)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "0.75rem",
  },
  archNoteText: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: 1.7,
  },
};