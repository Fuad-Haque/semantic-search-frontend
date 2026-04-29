"use client";
import { useState, useEffect, useRef } from "react";
import { SearchResponse } from "@/lib/types";
import { search } from "@/lib/api";

export default function SearchBar({
  onResults,
}: {
  onResults: (r: SearchResponse | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { onResults(null); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await search(query);
        onResults(results);
      } finally {
        setLoading(false);
      }
    }, 400);   // debounce 400ms — instant feel without spamming backend
    return () => clearTimeout(timerRef.current);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by meaning…"
        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-muted font-sans focus:outline-none focus:border-accent transition-colors"
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}