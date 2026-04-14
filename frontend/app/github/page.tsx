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

    const analyze = async () => {
        try {
            setLoading(true);
            setResults(null);

            const repoList = repos
                .split("\n")
                .map((r) => r.trim())
                .filter(Boolean);

            const data = await analyzeGithub(repoList, token);

            setResults(data);

        } catch (err) {
            console.error(err);
            alert("Analysis failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                GitHub Repository Analyzer
            </h1>

            <textarea
                placeholder={`owner/repo1
owner/repo2`}
                className="w-full h-32 bg-gray-900 p-4 rounded"
                onChange={(e) => setRepos(e.target.value)}
            />

            <input
                placeholder="GitHub Token (optional)"
                className="w-full p-3 bg-gray-900 rounded"
                onChange={(e) => setToken(e.target.value)}
            />

            <button
                onClick={analyze}
                className="bg-green-600 px-6 py-2 rounded"
            >
                Analyze
            </button>

            {loading && <Loading />}

            {results && <PipelineSteps results={results} />}

            {results && <ResultViewer results={results} />}

        </div>
    );
}