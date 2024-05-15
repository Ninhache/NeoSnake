import { ApiResponse } from "../@types/ApiType";
import { LocalStorageToken, fetchNewAccessToken } from "./auth";
import { isTokenExpired } from "./time";

interface GetParams {
  path: string;
  data?: Record<string, any>;
  headers?: HeadersInit;
}

interface PostParams {
  path: string;
  data?: Record<string, any>;
  headers?: HeadersInit;
}

/**
 * Overwrites the fetch function to include the authorization header and refreshes the access token if it is expired
 *
 * @param input
 * @param init
 * @returns
 */
export async function customFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  if (!(input instanceof Request)) {
    console.error("Input is not a Request object");
    throw new Error("Input is not a Request object");
  }

  let accessToken = input.headers.get("authorization") || "";

  if (accessToken && isTokenExpired(accessToken)) {
    const refreshToken = localStorage.getItem(LocalStorageToken.refreshToken);
    if (refreshToken) {
      const response = await fetchNewAccessToken(refreshToken);
      accessToken = response.accessToken;

      localStorage.setItem(LocalStorageToken.accessToken, accessToken);
    } else {
      throw new Error("No refresh token available");
    }
  }

  const headers = new Headers(init?.headers || {});
  headers.set("authorization", accessToken || "");
  headers.set("Content-Type", "application/json");

  const request = new Request(input, {
    ...init,
    headers: headers,
  });

  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response;
}

export const post = async ({
  path,
  data = {},
  headers = {},
}: PostParams): Promise<ApiResponse> => {
  const url = `${import.meta.env.VITE_SNAKE_API_ROUTE}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const get = async ({
  path,

  headers = {},
}: GetParams): Promise<any> => {
  const url = `${import.meta.env.VITE_SNAKE_API_ROUTE}${path}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  return response.json();
};

export const requestWithAuthorization = (
  input: RequestInfo,
  init?: RequestInit
): Request => {
  const headers = {
    ...init?.headers,
    Authorization: `${localStorage.getItem(LocalStorageToken.accessToken)}`,
    "Content-Type": "application/json",
  };

  return new Request(input, {
    ...init,
    headers: headers,
  });
};
