export default function PipelineSteps({ results }: { results: any }) {
    if (!results) return null;

    return (
        <div className="grid grid-cols-2 gap-6 mt-6">

            <div className="bg-gray-900 p-4 rounded">
                <h2 className="text-xl font-semibold">
                    Code Analysis
                </h2>

                <p className="text-gray-400">
                    Duplicate pairs found:
                    {" "}
                    {results.analysis?.raw_pairs?.length}
                </p>
            </div>

            <div className="bg-gray-900 p-4 rounded">
                <h2 className="text-xl font-semibold">
                    Abstraction
                </h2>

                <p>
                    Library:
                    {" "}
                    {results.abstraction?.library_name}
                </p>
            </div>

            <div className="bg-gray-900 p-4 rounded">
                <h2 className="text-xl font-semibold">
                    Impact
                </h2>

                <p>
                    Annual Savings:
                    {" "}
                    ${results.impact?.computed_savings?.annual_usd_saved}
                </p>
            </div>

            <div className="bg-gray-900 p-4 rounded">
                <h2 className="text-xl font-semibold">
                    Migration Plan
                </h2>

                <p>
                    Days Required:
                    {" "}
                    {results.migration?.total_estimated_days}
                </p>
            </div>

        </div>
    );
}