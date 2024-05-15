import {
  ApiErrorResponse,
  CampainMapSuccessResponse,
  NumberOfLevelSuccessResponse,
  PreviewLevelSuccessResponse,
} from "../@types/ApiType";
import { ScenarioData } from "../@types/Scenario";
import { customFetch, get, requestWithAuthorization } from "./api";
import { LocalStorageToken } from "./auth";

export const getNumberOfLevels = async (): Promise<
  NumberOfLevelSuccessResponse | ApiErrorResponse
> => {
  return await get({
    path: `/level`,
  });
};

export const getPreviewLevels = async (): Promise<
  PreviewLevelSuccessResponse | ApiErrorResponse
> => {
  if (
    localStorage.getItem(LocalStorageToken.accessToken) ||
    localStorage.getItem(LocalStorageToken.refreshToken)
  ) {
    const request = requestWithAuthorization(
      `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/preview`,
      {
        method: "GET",
      }
    );

    return await customFetch(request).then((response) => response.json());
  } else {
    return await get({
      path: `/level/preview`,
    });
  }
};

export const getCampaignLevel = async (
  id: string
): Promise<CampainMapSuccessResponse | ApiErrorResponse> => {
  return await get({
    path: `/level/${id}`,
  });
};

export const uploadCampaignCompletion = async (
  campaignId: string,
  time: number
): Promise<any> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/campaign/completion`,
    {
      method: "POST",
      body: JSON.stringify({
        mapId: campaignId,
        completionTime: time,
        completionDate: Date.now(),
      }),
    }
  );

  return await customFetch(request);
};

export const uploadMap = async (
  mapData: ScenarioData,
  uuid: string
): Promise<any> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/upload`,
    {
      method: "POST",
      body: JSON.stringify({ ...mapData, uuid }),
    }
  );

  return await customFetch(request);
};

export const getExistingMap = async (uuid: string): Promise<any> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/upload/${uuid}`,
    {
      method: "GET",
    }
  );

  return await customFetch(request);
};
