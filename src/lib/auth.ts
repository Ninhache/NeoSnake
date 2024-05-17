import {
  ApiErrorResponse,
  ApiResponse,
  LoginSuccessResponse,
  RefreshResponse,
  SignupSuccessResponse,
} from "../@types/ApiType";
import { get, post } from "./api";

export enum LocalStorageToken {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
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
): Promise<SignupSuccessResponse | ApiErrorResponse> => {
  return await post({
    path: "/auth/signup",
    data: { username, password },
  });
};

const signUpRequest = async (
  username: string,
  password: string
): Promise<SignupSuccessResponse | ApiErrorResponse> => {
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

const signInRequest = async (
  username: string,
  password: string
): Promise<LoginSuccessResponse | ApiErrorResponse> => {
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
  const { accessToken } = await fetchNewAccessToken(
    localStorage.getItem(`${LocalStorageToken.refreshToken}`) || ""
  );

  if (accessToken) {
    localStorage.setItem(`${LocalStorageToken.accessToken}`, accessToken);
  } else {
    localStorage.removeItem(`${LocalStorageToken.accessToken}`);
  }
};

export const fetchNewAccessToken = async (
  refreshToken: string
): Promise<RefreshResponse> => {
  try {
    const response = (await get({
      path: "/auth/refresh",
      headers: {
        authorization: refreshToken,
      },
    })) as RefreshResponse;

    if (!response.success) {
      throw new Error(response.message);
    } else {
      return response;
    }
  } catch (error) {
    throw new Error(`Failed to refresh token ${error}`);
  }
};

const logout = async () => {
  localStorage.removeItem(`${LocalStorageToken.accessToken}`);
  localStorage.removeItem(`${LocalStorageToken.refreshToken}`);
};

export { logout, signInRequest, signUpRequest };
