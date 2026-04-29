export interface Document {
  id: string;
  filename: string;
  total_chunks: number;
  token_count: number;
  embedding_model: string;
  chunk_strategy: string;
  status: "pending" | "processing" | "ready" | "failed";
  created_at: string;
}

export interface SearchResult {
  document_id: string;
  document_name: string;
  chunk_index: number;
  chunk_text: string;
  similarity_score: number;
  search_type: "semantic" | "keyword" | "hybrid";
}

export interface SearchResponse {
  query: string;
  semantic_results: SearchResult[];
  keyword_results: SearchResult[];
  hybrid_results: SearchResult[];
  latency_ms: number;
}