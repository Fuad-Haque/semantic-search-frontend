"use client";
import { useState } from "react";
import DropZone from "@/components/upload/DropZone";
import SearchBar from "@/components/search/SearchBar";
import ComparisonView from "@/components/search/ComparisonView";
import { SearchResponse } from "@/lib/types";

export default function SearchPage() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <main className="min-h-screen bg-background text-white p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-sans text-xl font-semibold">
          <span className="text-accent">Semantic</span> Search
        </h1>
        <button
          onClick={() => setShowUpload(v => !v)}
          className="text-sm px-4 py-2 rounded-lg border border-border hover:border-accent transition-colors"
        >
          {showUpload ? "Hide Upload" : "+ Add Documents"}
        </button>
      </div>

      {showUpload && (
        <div className="mb-8 p-6 bg-surface border border-border rounded-2xl">
          <DropZone onComplete={() => setShowUpload(false)} />
        </div>
      )}

      <div className="mb-6">
        <SearchBar onResults={setResults} />
      </div>

      {results && <ComparisonView data={results} />}
    </main>
  );
}