export default function Home() {
  return (
    <div className="space-y-6">

      <h1 className="text-4xl font-bold">
        Code Dedup Resolver
      </h1>

      <p className="text-gray-400">
        Multi-Agent AI system that detects duplicate code across repositories
        and designs shared libraries automatically.
      </p>

      <ul className="list-disc ml-6 text-gray-300">
        <li>Code Analysis Agent</li>
        <li>Abstraction Agent</li>
        <li>Impact Assessment Agent</li>
        <li>Migration Planning Agent</li>
      </ul>

    </div>
  );
}