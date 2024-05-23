import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CampaignMapSuccessResponse,
  ExistingCreateLevelSuccessResponse,
  GetCreateSuccessResponse,
  GetLevelSuccessResponse,
  OnlineMapSuccessResponse,
  PreviewLevelSuccessResponse,
} from "../../@types/ApiType";
import { BaseScenarioData } from "../../@types/scenario/Scenario";
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
      `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/campaign`,
      {
        method: "GET",
      }
    );

    return await customFetch(request).then((response) => response.json());
  } else {
    return await get({
      path: `/level/campaign`,
    });
  }
};

export const getCampaignLevel = async (
  id: string
): Promise<CampaignMapSuccessResponse | ApiErrorResponse> => {
  return await get({
    path: `/level/campaign/${id}`,
  });
};

export const checkAllLevelCompletions = async (): Promise<
  (ApiSuccessResponse & { allCompleted: boolean }) | ApiErrorResponse
> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/campaign/completion/check`,
    {
      method: "GET",
    }
  );

  return await customFetch(request).then((response) => response.json());
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

export const uploadCampaign = async (
  id: number,
  mapData: string
): Promise<any> => {
  const data = JSON.parse(mapData);
  const dd = JSON.stringify({ ...data, id });
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/campaign`,
    {
      method: "PUT",
      body: `${dd}`,
    }
  );

  return await customFetch(request);
};

/**
 * Admin only
 */
export const duplicateToCampaign = async (id: string): Promise<void> => {
  await getCreatedLevelById(id).then((res) => {
    if (res.success) {
      const { map_data } = res.data as {
        map_data: string;
      };
      console.log("parse", parseInt("hazeaz", 10));
      const futureCampaignId = parseInt(
        prompt("Futur campaign id (number only) ?") as string,
        10
      );

      if (isNaN(futureCampaignId)) {
        alert("Invalid campaign id");
        return;
      } else {
        uploadCampaign(futureCampaignId, map_data).then((res) => {
          console.log(res);
        });
      }
    }
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
        map_id: onlineId,
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
): Promise<{ nextId: number }> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/campaign/completion`,
    {
      method: "PUT",
      body: JSON.stringify({
        map_id: campaignId,
        completionTime: time,
        completionDate: Date.now(),
      }),
    }
  );

  return await customFetch(request).then((res) => res.json());
};

export const uploadMap = async (
  mapData: BaseScenarioData,
  uuid: string
): Promise<any> => {
  const request = requestWithAuthorization(
    `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/upload`,
    {
      method: "PUT",
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
