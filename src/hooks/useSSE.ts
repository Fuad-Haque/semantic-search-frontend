import { useState } from "react";
import { uploadDocument } from "@/lib/api";

export interface UploadProgress {
  status: "idle" | "uploading" | "complete" | "error";
  percent: number;
  total_chunks: number;
  processed: number;
  document_id?: string;
  error?: string;
}

export function useUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    status: "idle", percent: 0, total_chunks: 0, processed: 0,
  });

  const upload = async (file: File, strategy: string) => {
    setProgress({ status: "uploading", percent: 0, total_chunks: 0, processed: 0 });

    try {
      const response = await uploadDocument(file, strategy);
      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE messages end with double newline
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          let eventName = "";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) eventName = line.slice(7);
            if (line.startsWith("data: ")) data = line.slice(6);
          }
          if (!data) continue;
          const parsed = JSON.parse(data);

          if (eventName === "start") {
            setProgress(p => ({ ...p, total_chunks: parsed.total_chunks }));
          } else if (eventName === "progress") {
            setProgress(p => ({
              ...p, percent: parsed.percent, processed: parsed.processed,
            }));
          } else if (eventName === "complete") {
            setProgress({
              status: "complete",
              percent: 100,
              total_chunks: parsed.total_chunks,
              processed: parsed.total_chunks,
              document_id: parsed.document_id,
            });
          }
        }
      }
    } catch (e: any) {
      setProgress(p => ({ ...p, status: "error", error: e.message }));
    }
  };

  return { progress, upload };
}