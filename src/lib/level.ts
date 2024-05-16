import {
  ApiErrorResponse,
  CampainMapSuccessResponse,
  GetCreateSuccessResponse,
  GetLevelSuccessResponse,
  NumberOfLevelSuccessResponse,
  OnlineMapSuccessResponse,
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

export const getCreatedLevels = async ({
  page = 1,
  limit = 10,
  difficulty = -1,
}: {
  page?: number;
  limit?: number;
  difficulty?: number;
} = {}): Promise<OnlineMapSuccessResponse | ApiErrorResponse> => {
  const request = requestWithAuthorization(
    `${
      import.meta.env.VITE_SNAKE_API_ROUTE
    }/level/upload?page=${page}&limit=${limit}${
      difficulty > 0 && `&difficulty=${difficulty}`
    }`,
    {
      method: "GET",
    }
  );

  return await customFetch(request).then((response) => response.json());

  // return await get({
  //   path: `/level/upload?page=${page}&limit=${limit}${
  //     difficulty > 0 && `&difficulty=${difficulty}`
  //   }`,
  // });
};

export const deleteCreatedLevel = async (id: string): Promise<any> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/upload/${id}`,
    {
      method: "DELETE",
    }
  );

  return await customFetch(request).then((response) => response.json());
};

export const getCreatedLevel = async (): Promise<
  GetCreateSuccessResponse | ApiErrorResponse
> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/create`,
    {
      method: "GET",
    }
  );

  return await customFetch(request).then((response) => response.json());
};

export const getCreatedLevelById = async (
  uuid: string
): Promise<GetLevelSuccessResponse | ApiErrorResponse> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/online/${uuid}`,
    {
      method: "GET",
    }
  );

  return await customFetch(request).then((response) => response.json());
};

export const uploadOnlineCompletion = async (
  onlineId: string,
  time: number
): Promise<any> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/online/completion`,
    {
      method: "POST",
      body: JSON.stringify({
        mapId: onlineId,
        completionTime: time,
        completionDate: Date.now(),
      }),
    }
  );

  return await customFetch(request);
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
