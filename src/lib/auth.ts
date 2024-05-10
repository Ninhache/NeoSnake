import { SnakeMapData } from "../@types/MapTypes";
import { get, post } from "./api";

export enum LocalStorageToken {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
}

export interface LoginSuccessResponse extends ApiResponse {
  success: true;
  statusCode: number;
  accessToken: string;
  refreshToken: string;
  username: string;
}

export interface SignupSuccessResponse extends ApiResponse {
  success: true;
}

export interface CampainMapSuccessResponse extends ApiResponse {
  success: true;
  data: SnakeMapData;
}

export interface NumberOfLevelSuccessResponse extends ApiResponse {
  success: true;
  data: number;
}

export interface OnlineMapSuccessResponse extends ApiResponse {
  success: true;
  data: SnakeMapData;
}

const loginWithCredentials = async (
  username: string,
  password: string
): Promise<ApiResponse> => {
  const response = await post({
    path: "/auth/login",
    data: { username, password },
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
};

const signupWithCredentials = async (
  username: string,
  password: string
): Promise<SignupSuccessResponse | ErrorResponse> => {
  const response = await post({
    path: "/auth/signup",
    data: { username, password },
  });

  return response;
};

const signup = async (
  username: string,
  password: string
): Promise<SignupSuccessResponse | ErrorResponse> => {
  const signupInfo = await signupWithCredentials(username, password);

  if (!signupInfo.success) {
    throw new Error(signupInfo.message);
  }

  const loginInfo = await loginWithCredentials(username, password);

  if (!loginInfo.success) {
    throw new Error(loginInfo.message);
  }

  const { accessToken, refreshToken } = loginInfo as LoginSuccessResponse;

  if (accessToken && refreshToken) {
    localStorage.setItem(`${LocalStorageToken.accessToken}`, accessToken);
    localStorage.setItem(`${LocalStorageToken.refreshToken}`, refreshToken);
  }

  return {
    success: true,
    statusCode: 200,
    message: "Signup successful",
  };
};

const signin = async (
  username: string,
  password: string
): Promise<LoginSuccessResponse | ErrorResponse> => {
  const loginInfo = await loginWithCredentials(username, password);

  if (!loginInfo.success) {
    throw new Error(loginInfo.message);
  }

  const { accessToken, refreshToken } = loginInfo as LoginSuccessResponse;

  if (accessToken && refreshToken) {
    localStorage.setItem(LocalStorageToken.accessToken, accessToken);
    localStorage.setItem(LocalStorageToken.refreshToken, refreshToken);
    return {
      success: true,
      statusCode: 200,
      message: "Login successful",
      accessToken,
      refreshToken,
      username,
    };
  } else {
    throw new Error("Failed to login");
  }
};

export const updateStoredTokensFromRefresh = async (): Promise<void> => {
  const accessToken = await fetchNewAccessToken(
    localStorage.getItem(`${LocalStorageToken.refreshToken}`) as string
  );

  if (accessToken) {
    localStorage.setItem(`${LocalStorageToken.accessToken}`, accessToken);
    localStorage.setItem(`${LocalStorageToken.refreshToken}`, accessToken);
  }
};

export const fetchNewAccessToken = async (
  refreshToken: string
): Promise<string> => {
  throw new Error("TO FIX");
  try {
    const accessToken = await get({
      path: "/auth/refresh",
      // @ts-ignore
      data: { token: refreshToken },
    });

    return accessToken;
  } catch (error) {
    throw new Error(`Failed to refresh token ${error}`);
  }
};

const logout = async () => {
  localStorage.removeItem(`${LocalStorageToken.accessToken}`);
  localStorage.removeItem(`${LocalStorageToken.refreshToken}`);
};

export { logout, signin, signup };
