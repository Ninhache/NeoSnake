import { BlogPostPreviewPaginated } from "../../@types/BlogPosts";
import { get } from "./api";

export const getArticles = async ({
  page = 1,
  limit = 10,
  sortDate = "desc",
  tag = [],
  title = "",
}: {
  page?: number;
  limit?: number;
  sortDate?: "asc" | "desc";
  tag?: string[];
  title?: string;
}): Promise<BlogPostPreviewPaginated> => {
  return await get({
    path: `/article/?page=${page}&limit=${limit}&sortDate=${sortDate}&tag=${tag.join(
      ","
    )}${title.length > 3 ? `&title=${title}` : ""}`,
  });
};

export const getArticlesTags = async (): Promise<string[]> => {
  return await get({ path: "/article/tags" });
};
