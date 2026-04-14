"use client";

export default function Progress({ loading }: { loading: boolean }) {
    if (!loading) return null;

    return (
        <div style={{ marginTop: 20 }}>
            <p>🔍 Scanning repositories...</p>
            <div
                style={{
                    height: "10px",
                    background: "#ddd",
                    borderRadius: "5px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "70%",
                        height: "100%",
                        background: "#0070f3",
                        animation: "progress 2s infinite",
                    }}
                />
            </div>
        </div>
    );
}