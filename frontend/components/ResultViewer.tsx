"use client";

export default function ResultViewer({ results }: { results: any }) {
    if (!results) return null;

    return (
        <div className="space-y-10 mt-8">

            {/* PIPELINE INFO */}

            <div className="bg-gray-900 p-6 rounded">
                <h2 className="text-2xl font-bold mb-2">Pipeline Info</h2>

                <p>
                    <b>Repos analyzed:</b>{" "}
                    {results.repos_analyzed?.join(", ")}
                </p>

                <p>
                    <b>Pipeline duration:</b>{" "}
                    {results.pipeline_duration_seconds}s
                </p>
            </div>


            {/* ANALYSIS */}

            <div className="bg-gray-900 p-6 rounded">

                <h2 className="text-2xl font-bold mb-4">
                    Code Analysis
                </h2>

                <p>
                    <b>Summary:</b>{" "}
                    {results.analysis?.summary}
                </p>

                <p>
                    <b>Total duplicate pairs:</b>{" "}
                    {results.analysis?.total_duplicate_pairs ??
                        results.analysis?.raw_pairs?.length}
                </p>

                <p>
                    <b>Risk level:</b>{" "}
                    {results.analysis?.risk_level}
                </p>


                {/* DUPLICATE PAIRS */}

                <h3 className="text-xl mt-4 font-semibold">
                    Duplicate Function Pairs
                </h3>

                <div className="space-y-2 mt-2">

                    {results.analysis?.raw_pairs?.map(
                        (p: any, i: number) => (
                            <div
                                key={i}
                                className="border border-gray-700 p-3 rounded"
                            >
                                <p>
                                    <b>Repo A:</b> {p.fn_a.repo}
                                </p>

                                <p>
                                    <b>Repo B:</b> {p.fn_b.repo}
                                </p>

                                <p>
                                    <b>Similarity:</b> {p.similarity_score}
                                </p>

                                <p>
                                    <b>Severity:</b> {p.severity}
                                </p>
                            </div>
                        )
                    )}

                    {results.analysis?.raw_pairs?.length === 0 && (
                        <p className="text-gray-400">
                            No duplicate functions detected.
                        </p>
                    )}

                </div>

            </div>


            {/* ABSTRACTION */}

            <div className="bg-gray-900 p-6 rounded">

                <h2 className="text-2xl font-bold mb-4">
                    Suggested Shared Library
                </h2>

                <p>
                    <b>Name:</b>{" "}
                    {results.abstraction?.library_name}
                </p>

                <p>
                    <b>Version:</b>{" "}
                    {results.abstraction?.version}
                </p>

                <p className="text-gray-400">
                    {results.abstraction?.description}
                </p>


                <h3 className="text-xl mt-4 font-semibold">
                    Modules
                </h3>

                <div className="space-y-4 mt-2">

                    {results.abstraction?.modules?.map(
                        (m: any, i: number) => (
                            <div
                                key={i}
                                className="border border-gray-700 p-4 rounded"
                            >

                                <p className="font-semibold">
                                    {m.module_name}
                                </p>

                                <p className="text-gray-400">
                                    {m.purpose}
                                </p>


                                <div className="mt-2">

                                    <b>Interfaces:</b>

                                    {m.interfaces?.map(
                                        (iface: any, j: number) => (
                                            <div
                                                key={j}
                                                className="ml-4 mt-1 text-sm"
                                            >
                                                <p>
                                                    {iface.signature}
                                                </p>

                                                <p className="text-gray-400">
                                                    {iface.description}
                                                </p>
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )
                    )}

                </div>

            </div>


            {/* IMPACT */}

            <div className="bg-gray-900 p-6 rounded">

                <h2 className="text-2xl font-bold mb-4">
                    Impact Assessment
                </h2>

                <p className="text-gray-300">
                    {results.impact?.executive_summary}
                </p>


                <div className="grid grid-cols-2 gap-4 mt-4">

                    <div>
                        <b>Annual Savings</b>
                        <p>
                            $
                            {
                                results.impact?.financial_impact
                                    ?.annual_savings_usd
                            }
                        </p>
                    </div>

                    <div>
                        <b>Monthly Hours Saved</b>
                        <p>
                            {
                                results.impact?.financial_impact
                                    ?.monthly_hours_saved
                            }
                        </p>
                    </div>

                    <div>
                        <b>Lines Eliminated</b>
                        <p>
                            {
                                results.impact?.financial_impact
                                    ?.lines_eliminated
                            }
                        </p>
                    </div>

                    <div>
                        <b>Priority</b>
                        <p>{results.impact?.priority}</p>
                    </div>

                </div>

            </div>


            {/* MIGRATION */}

            <div className="bg-gray-900 p-6 rounded">

                <h2 className="text-2xl font-bold mb-4">
                    Migration Plan
                </h2>

                <p>
                    <b>Total estimated days:</b>{" "}
                    {results.migration?.total_estimated_days}
                </p>


                <h3 className="text-xl mt-4 font-semibold">
                    Phases
                </h3>

                <div className="space-y-4 mt-2">

                    {results.migration?.phases?.map(
                        (phase: any, i: number) => (
                            <div
                                key={i}
                                className="border border-gray-700 p-4 rounded"
                            >

                                <p className="font-semibold">
                                    Phase {phase.phase_number}: {phase.name}
                                </p>

                                <p className="text-gray-400">
                                    {phase.description}
                                </p>

                                <p>
                                    <b>Estimated days:</b>{" "}
                                    {phase.estimated_days}
                                </p>

                                <p>
                                    <b>Tasks:</b>
                                </p>

                                <ul className="list-disc ml-6">
                                    {phase.tasks?.map(
                                        (t: string, j: number) => (
                                            <li key={j}>{t}</li>
                                        )
                                    )}
                                </ul>

                            </div>
                        )
                    )}

                </div>

            </div>


            {/* RAW JSON (DEBUG) */}

            <div className="bg-gray-900 p-6 rounded">

                <h2 className="text-xl font-bold mb-2">
                    Raw Output
                </h2>

                <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(results, null, 2)}
                </pre>

            </div>

        </div>
    );
}