const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function analyzeGithub(repos: string[], token: string) {
    const res = await fetch(`${API_URL}/api/analyze-github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos, token }),
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}

export async function analyzeLocal(repos: { repoA: string; repoB: string }) {
    const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos }),
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}