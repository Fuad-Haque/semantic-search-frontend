"use client";
import { useState, useEffect } from "react";
import { Document } from "@/lib/types";
import { getDocuments, deleteDocument } from "@/lib/api";

export default function CollectionTable() {
  const [docs, setDocs] = useState<Document[]>([]);

  const load = async () => setDocs(await getDocuments());
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    load();
  };

  const statusColors: Record<string, string> = {
    ready: "text-teal",
    processing: "text-accent",
    pending: "text-muted",
    failed: "text-red-400",
  };

  return (
    <table className="w-full text-sm font-mono">
      <thead>
        <tr className="text-muted text-xs uppercase text-left border-b border-border">
          <th className="py-2 pr-4">File</th>
          <th className="py-2 pr-4">Strategy</th>
          <th className="py-2 pr-4">Chunks</th>
          <th className="py-2 pr-4">Tokens</th>
          <th className="py-2 pr-4">Model</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {docs.map(doc => (
          <tr key={doc.id} className="border-b border-border/50 hover:bg-surface/50">
            <td className="py-3 pr-4 text-white">{doc.filename}</td>
            <td className="py-3 pr-4 text-muted">{doc.chunk_strategy}</td>
            <td className="py-3 pr-4 text-accent">{doc.total_chunks}</td>
            <td className="py-3 pr-4 text-muted">{doc.token_count.toLocaleString()}</td>
            <td className="py-3 pr-4 text-muted text-xs">{doc.embedding_model}</td>
            <td className={`py-3 pr-4 ${statusColors[doc.status]}`}>{doc.status}</td>
            <td className="py-3">
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-400/60 hover:text-red-400 transition-colors text-xs"
              >
                delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}