import axios from "axios";

// ✅ .env 있으면 그걸 쓰고, 없으면 localhost:8000
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 로그(필요하면 주석 해제)
// api.interceptors.request.use((config) => {
//   console.log("[API Request]", config.method?.toUpperCase(), config.url, config.data);
//   return config;
// });

// ✅ 응답 에러를 보기 좋게 정리 (Toast/콘솔 확인용)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const detail = err?.response?.data?.detail;
    const message = err?.message;

    console.error(
      "[API Error]",
      status || "",
      detail || message || "Unknown error"
    );

    return Promise.reject(err);
  }
);

console.log("BASE_URL =", BASE_URL);
