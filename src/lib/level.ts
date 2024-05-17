import {
  ApiErrorResponse,
  CampaignMapSuccessResponse,
  ExistingCreateLevelSuccessResponse,
  GetCreateSuccessResponse,
  GetLevelSuccessResponse,
  OnlineMapSuccessResponse,
  PreviewLevelSuccessResponse,
} from "../@types/ApiType";
import { ScenarioData } from "../@types/Scenario";
import { customFetch, get, requestWithAuthorization } from "./api";
import { LocalStorageToken } from "./auth";

export const getCampaignPreviewLevels = async (): Promise<
  PreviewLevelSuccessResponse | ApiErrorResponse
> => {
  if (
    localStorage.getItem(LocalStorageToken.accessToken) ||
    localStorage.getItem(LocalStorageToken.refreshToken)
  ) {
    const request = requestWithAuthorization(
      `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/campaign/preview`,
      {
        method: "GET",
      }
    );

    return await customFetch(request).then((response) => response.json());
  } else {
    return await get({
      path: `/level/campaign/preview`,
    });
  }
};

export const getCampaignLevel = async (
  id: string
): Promise<CampaignMapSuccessResponse | ApiErrorResponse> => {
  return await get({
    path: `/level/${id}`,
  });
};

export const getOnlineCreatedLevels = async ({
  page = 1,
  limit = 10,
  difficulty = -1,
}: {
  page?: number;
  limit?: number;
  difficulty?: number;
} = {}): Promise<OnlineMapSuccessResponse | ApiErrorResponse> => {
  if (
    localStorage.getItem(LocalStorageToken.accessToken) ||
    localStorage.getItem(LocalStorageToken.refreshToken)
  ) {
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
  } else {
    return await get({
      path: `/level/upload?page=${page}&limit=${limit}${
        difficulty > 0 && `&difficulty=${difficulty}`
      }`,
    });
  }
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
  return await get({
    path: `/level/online/${uuid}`,
  });

  // const request = requestWithAuthorization(
  //   `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/online/${uuid}`,
  //   {
  //     method: "GET",
  //   }
  // );

  // return await customFetch(request).then((response) => response.json());
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

export const getExistingMap = async (
  uuid: string
): Promise<ExistingCreateLevelSuccessResponse | ApiErrorResponse> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/upload/${uuid}`,
    {
      method: "GET",
    }
  );

  return await customFetch(request).then((res) => res.json());
};
