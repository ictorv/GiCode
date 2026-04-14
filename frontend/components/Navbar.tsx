"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const path = usePathname();

    const links = [
        { href: "/", label: "Overview" },
        { href: "/github", label: "GitHub Analyzer" },
        { href: "/analyze", label: "Local Analyzer" },
    ];

    return (
        <nav style={styles.nav}>
            {/* Scanline effect */}
            <div style={styles.scanline} />

            <div style={styles.inner}>
                {/* Logo */}
                <Link href="/" style={styles.logoWrap}>
                    <div style={styles.logoIcon}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <polygon points="11,1 21,6 21,16 11,21 1,16 1,6" stroke="#00c8ff" strokeWidth="1.2" fill="none" />
                            <polygon points="11,5 17,8.5 17,15.5 11,19 5,15.5 5,8.5" stroke="#00c8ff" strokeWidth="0.6" fill="rgba(0,200,255,0.06)" />
                            <circle cx="11" cy="11" r="2.5" fill="#00c8ff" />
                            <line x1="11" y1="1" x2="11" y2="5" stroke="#00c8ff" strokeWidth="0.6" />
                            <line x1="11" y1="17" x2="11" y2="21" stroke="#00c8ff" strokeWidth="0.6" />
                            <line x1="21" y1="6" x2="17" y2="8.5" stroke="#00c8ff" strokeWidth="0.6" />
                            <line x1="5" y1="8.5" x2="1" y2="6" stroke="#00c8ff" strokeWidth="0.6" />
                            <line x1="21" y1="16" x2="17" y2="13.5" stroke="#00c8ff" strokeWidth="0.6" />
                            <line x1="5" y1="13.5" x2="1" y2="16" stroke="#00c8ff" strokeWidth="0.6" />
                        </svg>
                    </div>
                    <div>
                        <div style={styles.logoName}>CodeMind</div>
                        <div style={styles.logoSub}>MULTI-AGENT SYSTEM v2.0</div>
                    </div>
                </Link>

                {/* Status badge */}
                <div style={styles.statusBadge}>
                    <span style={styles.statusDot} />
                    <span style={styles.statusText}>4 AGENTS ONLINE</span>
                </div>

                {/* Nav links */}
                <div style={styles.links}>
                    {links.map(({ href, label }) => {
                        const active = path === href;
                        return (
                            <Link key={href} href={href} style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}>
                                {active && <span style={styles.linkMarker} />}
                                {label}
                                {active && <div style={styles.linkUnderline} />}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

const styles: Record<string, React.CSSProperties> = {
    nav: {
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(2, 4, 8, 0.92)",
        borderBottom: "1px solid rgba(0, 200, 255, 0.12)",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
    },
    scanline: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)",
        animation: "data-flow 3s linear infinite",
        backgroundSize: "200% 100%",
    },
    inner: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        gap: "2rem",
    },
    logoWrap: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        marginRight: "auto",
    },
    logoIcon: {
        width: "38px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,200,255,0.06)",
        border: "1px solid rgba(0,200,255,0.2)",
        borderRadius: "8px",
        animation: "pulse-glow 3s ease-in-out infinite",
    },
    logoName: {
        fontFamily: "var(--font-display)",
        fontSize: "18px",
        fontWeight: 800,
        color: "#e8f4ff",
        letterSpacing: "-0.02em",
        lineHeight: 1,
    },
    logoSub: {
        fontFamily: "var(--font-mono)",
        fontSize: "8px",
        color: "var(--accent-cyan)",
        letterSpacing: "0.15em",
        lineHeight: 1,
        marginTop: "3px",
    },
    statusBadge: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        background: "rgba(0,255,136,0.06)",
        border: "1px solid rgba(0,255,136,0.15)",
        borderRadius: "100px",
        padding: "5px 12px",
    },
    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#00ff88",
        boxShadow: "0 0 8px #00ff88",
        animation: "pulse-glow 2s ease-in-out infinite",
        display: "block",
    },
    statusText: {
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: "#00ff88",
        letterSpacing: "0.15em",
        fontWeight: 500,
    },
    links: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    link: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        letterSpacing: "0.05em",
        color: "var(--text-secondary)",
        textDecoration: "none",
        padding: "6px 14px",
        borderRadius: "6px",
        transition: "all 0.2s",
        border: "1px solid transparent",
    },
    linkActive: {
        color: "var(--accent-cyan)",
        background: "rgba(0,200,255,0.07)",
        border: "1px solid rgba(0,200,255,0.18)",
    },
    linkMarker: {
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: "var(--accent-cyan)",
        boxShadow: "0 0 6px var(--accent-cyan)",
        display: "block",
        flexShrink: 0,
    },
    linkUnderline: {
        position: "absolute",
        bottom: "2px",
        left: "14px",
        right: "14px",
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--accent-cyan), transparent)",
    },
};