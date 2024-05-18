import {
  ApiErrorResponse,
  CampaignMapSuccessResponse,
  ExistingCreateLevelSuccessResponse,
  GetCreateSuccessResponse,
  GetLevelSuccessResponse,
  OnlineMapSuccessResponse,
  PreviewLevelSuccessResponse,
} from "../../@types/ApiType";
import { ScenarioData } from "../../@types/Scenario";
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
  creatorName = "",
  sortDate = "desc",
}: {
  page?: number;
  limit?: number;
  difficulty?: number;
  creatorName?: string;
  sortDate?: "asc" | "desc";
} = {}): Promise<OnlineMapSuccessResponse | ApiErrorResponse> => {
  if (
    localStorage.getItem(LocalStorageToken.accessToken) ||
    localStorage.getItem(LocalStorageToken.refreshToken)
  ) {
    const request = requestWithAuthorization(
      `${
        import.meta.env.VITE_SNAKE_API_ROUTE
      }/level/upload?page=${page}&limit=${limit}${
        difficulty > 0 ? `&difficulty=${difficulty}` : ""
      }${creatorName.length > 2 ? `&name=${creatorName}` : ""}${
        sortDate ? `&sortDate=${sortDate}` : ""
      }`,
      {
        method: "GET",
      }
    );

    return await customFetch(request).then((response) => {
      if (response.status === 204) {
        return {
          success: true,
          data: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
        };
      } else {
        return response.json();
      }
    });
  } else {
    return await get({
      path: `/level/upload?page=${page}&limit=${limit}${
        difficulty > 0 ? `&difficulty=${difficulty}` : ""
      }
        ${creatorName ? `&name=${creatorName}` : ""}${
        sortDate ? `&sortDate=${sortDate}` : ""
      }
        `,
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

export const getCreatedLevelFromUser = async (
  username: string,
  {
    page = 1,
    limit = 10,
    difficulty = -1,
    sortDate = "desc",
  }: {
    page?: number;
    limit?: number;
    difficulty?: number;
    creatorName?: string;
    sortDate?: "asc" | "desc";
  }
): Promise<GetCreateSuccessResponse | ApiErrorResponse> => {
  if (
    localStorage.getItem(LocalStorageToken.accessToken) ||
    localStorage.getItem(LocalStorageToken.refreshToken)
  ) {
    const request = requestWithAuthorization(
      `${
        import.meta.env.VITE_SNAKE_API_ROUTE
      }/level/create/${username}?page=${page}&limit=${limit}&sortDate=${sortDate}${
        difficulty > 0 ? `&difficulty=${difficulty}` : ""
      }`,
      {
        method: "GET",
      }
    );

    return await customFetch(request).then((response) => {
      if (response.status === 204) {
        return {
          success: true,
          data: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
        };
      } else {
        return response.json();
      }
    });
  } else {
    return await get({
      path: `/level/create/${username}?page=${page}&limit=${limit}&sortDate=${sortDate}${
        difficulty > 0 ? `&difficulty=${difficulty}` : ""
      }`,
    });
  }
};

export const getCreatedLevel = async ({
  page = 1,
  limit = 10,
  difficulty = -1,
  sortDate = "desc",
}: {
  page?: number;
  limit?: number;
  difficulty?: number;
  sortDate?: "asc" | "desc";
}): Promise<GetCreateSuccessResponse | ApiErrorResponse> => {
  const request = requestWithAuthorization(
    `${
      import.meta.env.VITE_SNAKE_API_ROUTE
    }/level/create?page=${page}&limit=${limit}&sortDate=${sortDate}${
      difficulty > 0 ? `&difficulty=${difficulty}` : ""
    }`,
    {
      method: "GET",
    }
  );

  return await customFetch(request).then((response) => {
    if (response.status === 204) {
      return {
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 1,
        },
      };
    } else {
      return response.json();
    }
  });
};

export const getCreatedLevelById = async (
  uuid: string
): Promise<GetLevelSuccessResponse | ApiErrorResponse> => {
  return await get({
    path: `/level/online/${uuid}`,
  });
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
