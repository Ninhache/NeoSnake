import { useEffect, useState } from "react";
import { BlogPostPreview } from "../../@types/BlogPosts";
import { getArticles, getArticlesTags } from "../../lib/services/article";
import UIPagination from "../UI/UIPagination";
import UISuspense from "../UI/UISuspense";
import UITagSelector from "../UI/UITagSelector";
import LayoutComponent from "../layouts/LayoutComponent";
import LandingPageModal from "./LandingPage";
import UIArticlePreview from "./UIArticlePreview";

const WidgetHome: React.FC = () => {
  const [data, setData] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  // const [sortDate, setSortDate] = useState<"asc" | "desc">("desc");
  // const [title, setTitle] = useState<string>("");

  const [articlesTags, setArticlesTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modalShown = sessionStorage.getItem("modalShown");

    if (!modalShown) {
      setIsOpen(true);
      sessionStorage.setItem("modalShown", "true");
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getArticles({ page, limit, tag: selectedTags })
        .then((response) => {
          setData(response.data);

          setPage(response.pagination.page);
          setLimit(response.pagination.limit);
          setTotalItems(response.pagination.totalItems);
          setTotalPages(response.pagination.totalPages);
        })
        .catch((error: Response) => {
          setError(error.status);
        }),
      getArticlesTags().then((data) => {
        setArticlesTags(data);
      }),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getArticles({ page, limit, tag: selectedTags }).then((response) => {
      setData(response.data);

      // Keep only the tags from the articles to prevent the user from ending up with no results at the end
      const newTags = response.data.reduce((acc, article) => {
        return [...acc, ...article.tags];
      }, [] as string[]);

      setArticlesTags(Array.from(new Set([...newTags])));

      setPage(response.pagination.page);
      setLimit(response.pagination.limit);
      setTotalItems(response.pagination.totalItems);
      setTotalPages(response.pagination.totalPages);
    });
  }, [selectedTags, page, limit]);

  if (error !== null) {
    return <LayoutComponent>Error</LayoutComponent>;
  }

  if (loading) {
    return (
      <LayoutComponent>
        <UISuspense />
      </LayoutComponent>
    );
  }

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  };

  const handlePrevPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  return (
    <LayoutComponent>
      <div className="flex justify-between mb-4">
        <LandingPageModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
        <UITagSelector
          tags={articlesTags}
          selectedTags={selectedTags}
          onTagChange={handleTagChange}
        />
        {totalItems > limit && (
          <div className="flex items-center gap-2">
            <p className="mr-2 text-gray-400">
              {totalItems} article{totalItems > 0 ? "s" : ""} in total
            </p>
            <div>
              <UIPagination
                page={page}
                totalPages={totalPages}
                onNext={handleNextPage}
                onPrev={handlePrevPage}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center -mx-2">
        {data.map((article) => (
          <UIArticlePreview
            key={`${article.id}-${article.path}`}
            article={article}
          />
        ))}
      </div>
    </LayoutComponent>
  );
};

export default WidgetHome;
