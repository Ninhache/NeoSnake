import {
  ApiErrorResponse,
  CampainMapSuccessResponse,
  NumberOfLevelSuccessResponse,
} from "../@types/ApiType";
import { ScenarioData } from "../@types/Scenario";
import { customFetch, get, requestWithAuthorization } from "./api";

export const getNumberOfLevels = async (): Promise<
  NumberOfLevelSuccessResponse | ApiErrorResponse
> => {
  return await get({
    path: `/level`,
  });
};

export const getCampaignLevel = async (
  id: number
): Promise<CampainMapSuccessResponse | ApiErrorResponse> => {
  return await get({
    path: `/level/${id}`,
  });
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
