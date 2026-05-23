import { BACKEND_URL } from "@/config/app-config";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || BACKEND_URL;

type ApiOptions = RequestInit & {
  skipJsonContentType?: boolean;
};

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}

export async function apiJson<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { skipJsonContentType, headers, ...restOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      ...(skipJsonContentType ? {} : { "Content-Type": "application/json" }),
      ...(headers || {}),
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
}

export async function apiForm<T>(
  endpoint: string,
  formData: FormData,
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
}
