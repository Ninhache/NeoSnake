export type BlogPostPreviewPaginated = {
  data: BlogPostPreview[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type BlogPostPreview = {
  id: number;
  title: string;
  path: string;
  date: string;
  abstract: string;
  image: string;
  authorName: string;
  authorImage: string;
  tags: string[];
  readTime: number;
};

export type BlogPost = BlogPostPreview & {
  content: string;
};
