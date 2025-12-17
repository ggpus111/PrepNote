import { api } from "./api";

export type SummaryLength = "short" | "medium" | "long";
export type Audience = "elementary" | "middle" | "high" | "college" | "office";

export type CreateSummaryPayload = {
  title?: string;
  text: string;
  options?: {
    length?: SummaryLength;
    audience?: Audience; // ✅ 추가
  };
};

export type CreateSummaryResponse = {
  summaryId: string;
  summary: string;
  outline: string[];
};

/**
 * 발표 자료 요약 생성
 * - text: 추출된 순수 텍스트
 * - title: 발표 제목
 * - options.length: short | medium | long
 * - options.audience: elementary | middle | high | college | office
 */
export async function createSummary(payload: CreateSummaryPayload) {
  const res = await api.post("/summaries", payload);
  return res.data as CreateSummaryResponse;
}

/**
 * 파일(PDF/DOCX/TXT)에서 텍스트 추출
 */
export async function extractTextFromFile(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/extract-text", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data as {
    text: string;
  };
}
