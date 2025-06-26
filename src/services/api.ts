import axios from "axios";

export interface ShortenRequest {
  target_url: string;
}

export interface ShortenResponse {
  short_url: string;
  target_url: string;
}

export interface VisitsResponse {
  visits: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function shortenUrl(
  data: ShortenRequest
): Promise<ShortenResponse> {
  const response = await api.post("/shorten", data);

  if (response.status !== 200) {
    throw new Error("Failed to shorten URL");
  }

  return response.data;
}

export async function getVisits(secret_key: string): Promise<VisitsResponse> {
  const response = await api.get(`/visits/${secret_key}`);
  if (response.status !== 200) {
    throw new Error("Failed to get visits");
  }
  return response.data;
}