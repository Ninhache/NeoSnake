export type BlogPostPreview = {
  id: number;
  title: string;
  path: string;
  date: string;
  abstract: string;
  image: string;
  authorName: string;
  authorImage: string;
};

export type BlogPost = BlogPostPreview & {
  content: string;
};
