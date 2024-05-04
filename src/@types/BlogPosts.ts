export type BlogPostPreview = {
  id: number;
  title: string;
  path: string;
  date: string;
  abstract: string;
  image: string;
  authorname: string;
  authorimage: string;
};

export type BlogPost = BlogPostPreview & {
  content: string;
};
