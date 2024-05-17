import { OptionsScenarioData, ScenarioData, ScenarioMapData } from "./Scenario";

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

export interface CampaignMapSuccessResponse extends ApiResponse {
  success: true;
  data: string;
}

export interface OnlinePreview extends ScenarioMapData {
  id: string;
  creatorName: string;
  preview: {
    options: OptionsScenarioData;
  } & ScenarioMapData;
  completed: boolean;
  completionTime?: Date;
}

export interface OnlineMapSuccessResponse extends ApiResponse {
  success: true;
  data: OnlinePreview[];
}

export interface Preview extends ScenarioMapData {
  id: string;
  options: OptionsScenarioData;
}

export interface GetCreateSuccessResponse extends ApiResponse {
  success: true;
  data: Preview[];
}

export interface GetLevelSuccessResponse extends ApiResponse {
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

export interface ExistingCreateLevelSuccessResponse extends ApiResponse {
  success: true;
  data: {
    map_data: string;
  };
}

export interface ScenariosName {
  id: string;
  preview: {
    options: OptionsScenarioData;
  } & ScenarioMapData;
  completed: boolean;
  completionTime?: Date;
}

export interface PreviewLevelSuccessResponse extends ApiResponse {
  success: true;
  data: ScenariosName[];
}

export interface RefreshResponse extends ApiResponse {
  accessToken: string;
}
