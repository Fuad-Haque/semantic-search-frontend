"use client";
import { useCallback, useState } from "react";
import { useUpload } from "@/hooks/useSSE";

export default function DropZone({ onComplete }: { onComplete?: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [strategy, setStrategy] = useState("fixed");
  const { progress, upload } = useUpload();

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await upload(file, strategy);
      onComplete?.();
    }
  }, [strategy, upload, onComplete]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await upload(file, strategy);
      onComplete?.();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Strategy selector */}
      <div className="flex gap-2">
        {["fixed", "sentence", "paragraph"].map(s => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
              strategy === s
                ? "bg-accent text-white"
                : "bg-surface text-muted hover:text-white border border-border"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          dragOver ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
        }`}
      >
        <input type="file" className="hidden" accept=".txt,.pdf,.md" onChange={handleFileInput} />
        <p className="text-muted text-sm">Drop a .txt / .pdf / .md file here or click to browse</p>
      </label>

      {/* Progress */}
      {progress.status === "uploading" && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted font-mono">
            <span>Embedding chunks…</span>
            <span>{progress.processed} / {progress.total_chunks}</span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5">
            <div
              className="bg-teal h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {progress.status === "complete" && (
        <p className="text-teal text-sm font-mono">
          ✓ Indexed {progress.total_chunks} chunks
        </p>
      )}
    </div>
  );
}