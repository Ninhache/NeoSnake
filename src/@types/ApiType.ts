import { SnakeMapData } from "./MapTypes";

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface ApiErrorResponse extends ApiResponse {
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

export interface RefreshResponse extends ApiResponse {
  accessToken: string;
}
