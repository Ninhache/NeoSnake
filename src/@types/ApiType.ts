import {
  OptionsScenarioData,
  ScenarioFruits,
  ScenarioMapData,
  ScenarioObstacles,
} from "./Scenario";

export interface OnlinePreview extends ScenarioMapData {
  id: string;
  creatorName: string;
  options: OptionsScenarioData;
  fruits: ScenarioFruits[];
  obstacles: ScenarioObstacles[];
  completed: boolean;
  completionTime?: Date;
}

export interface Preview extends ScenarioMapData {
  id: string;
  options: OptionsScenarioData;
}

export interface ScenariosName {
  id: string;
  preview: {
    options: OptionsScenarioData;
  } & ScenarioMapData;
  completed: boolean;
  completionTime?: Date;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface Pagination {
  pagination: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface ApiErrorResponse extends ApiResponse {
  success: false;
}

export interface ApiSuccessResponse extends ApiResponse {
  success: true;
}

export interface LoginSuccessResponse extends ApiSuccessResponse {
  success: true;
  statusCode: number;
  accessToken: string;
  refreshToken: string;
  username: string;
}

export interface SignupSuccessResponse extends ApiSuccessResponse {
  success: true;
}

export interface CampaignMapSuccessResponse extends ApiSuccessResponse {
  success: true;
  data: string;
}

export interface OnlineMapSuccessResponse
  extends ApiSuccessResponse,
    Pagination {
  success: true;
  data: OnlinePreview[];
}

export interface GetCreateSuccessResponse
  extends ApiSuccessResponse,
    Pagination {
  success: true;
  data: OnlinePreview[];
}

export interface GetLevelSuccessResponse extends ApiSuccessResponse {
  success: true;
  data: {
    id: string;
    map_data: string;
    creator_id: number;
    difficulty: number;
    created_at: Date;
    updated_at: Date;
  };
}

export interface ExistingCreateLevelSuccessResponse extends ApiSuccessResponse {
  success: true;
  data: {
    map_data: string;
  };
}

export interface PreviewLevelSuccessResponse extends ApiSuccessResponse {
  success: true;
  data: ScenariosName[];
}

export interface RefreshResponse extends ApiSuccessResponse {
  accessToken: string;
}
