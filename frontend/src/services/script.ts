import { api } from "./api";

export async function createScript(payload: {
  title: string;
  summaryText: string;
  outline?: string[];
  options?: {
    tone?: "formal" | "friendly" | "energetic";
    speakerCount?: number;
    targetMinutes?: number;
  };
}) {
  const res = await api.post("/scripts", payload);
  return res.data as { scriptId: string; content: string[] };
}
