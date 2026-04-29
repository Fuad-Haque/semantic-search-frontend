import { SearchResponse } from "@/lib/types";
import ResultCard from "./ResultCard";

export default function ComparisonView({ data }: { data: SearchResponse }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono text-muted">
          Results for <span className="text-white">"{data.query}"</span>
        </h2>
        <span className="text-xs font-mono text-muted">{data.latency_ms}ms</span>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Keyword */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider">
            Keyword Search
          </h3>
          {data.keyword_results.length === 0 && (
            <p className="text-xs text-muted">No keyword matches</p>
          )}
          {data.keyword_results.slice(0, 5).map((r, i) => (
            <ResultCard key={i} result={r} />
          ))}
        </div>

        {/* Semantic */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono text-accent uppercase tracking-wider">
            Semantic Search
          </h3>
          {data.semantic_results.slice(0, 5).map((r, i) => (
            <ResultCard key={i} result={r} />
          ))}
        </div>

        {/* Hybrid */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono text-teal uppercase tracking-wider">
            Hybrid (RRF)
          </h3>
          {data.hybrid_results.slice(0, 5).map((r, i) => (
            <ResultCard key={i} result={r} />
          ))}
        </div>
      </div>
    </div>
  );
}