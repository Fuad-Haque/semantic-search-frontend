import { SearchResult } from "@/lib/types";

const typeColors: Record<string, string> = {
  semantic: "#6C63FF",
  keyword: "#F59E0B",
  hybrid: "#00D4AA",
};

export default function ResultCard({ result }: { result: SearchResult }) {
  const color = typeColors[result.search_type] || "#fff";
  const scorePercent = Math.min(result.similarity_score * 100, 100);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-accent/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">{result.document_name} · chunk {result.chunk_index}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: `${color}20`, color }}>
          {result.search_type}
        </span>
      </div>

      <p className="text-sm text-white/80 leading-relaxed line-clamp-4">{result.chunk_text}</p>

      {/* Similarity score bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-border rounded-full h-1">
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${scorePercent}%`, background: color }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color }}>
          {result.similarity_score.toFixed(4)}
        </span>
      </div>
    </div>
  );
}