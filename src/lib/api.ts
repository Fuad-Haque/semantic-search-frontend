const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getDocuments() {
  const res = await fetch(`${BASE}/documents/`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function deleteDocument(id: string) {
  await fetch(`${BASE}/documents/${id}`, { method: "DELETE" });
}

export async function search(query: string, topK = 10): Promise<SearchResponse> {
  const res = await fetch(`${BASE}/search/?q=${encodeURIComponent(query)}&top_k=${topK}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// Returns the raw Response for SSE streaming — caller handles the stream
export function uploadDocument(file: File, strategy: string): Promise<Response> {
  const form = new FormData();
  form.append("file", file);
  return fetch(`${BASE}/documents/upload?strategy=${strategy}`, {
    method: "POST",
    body: form,
  });
}