"use client";

import { useState } from "react";
import { analyzeLocal } from "../../lib/api";
import ResultViewer from "../../components/ResultViewer";

export default function AnalyzePage() {
    const [codeA, setCodeA] = useState("");
    const [codeB, setCodeB] = useState("");
    const [results, setResults] = useState<any>(null);

    const analyze = async () => {

        const data = await analyzeLocal({
            repoA: codeA,
            repoB: codeB,
        });

        setResults(data);
    };

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Local Code Analyzer
            </h1>

            <textarea
                placeholder="Repo A code"
                className="w-full h-40 bg-gray-900 p-4"
                onChange={(e) => setCodeA(e.target.value)}
            />

            <textarea
                placeholder="Repo B code"
                className="w-full h-40 bg-gray-900 p-4"
                onChange={(e) => setCodeB(e.target.value)}
            />

            <button
                onClick={analyze}
                className="bg-blue-600 px-6 py-2 rounded"
            >
                Analyze
            </button>

            {results && <ResultViewer results={results} />}

        </div>
    );
}