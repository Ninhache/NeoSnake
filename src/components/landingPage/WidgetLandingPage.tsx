import { useEffect, useState } from "react";
import { BlogPostPreview } from "../../@types/BlogPosts";
import UIArticlePreview from "./UIArticlePreview";
import LayoutComponent from "../layouts/LayoutComponent";
import UISuspense from "../UI/UISuspense";

type Props = {};
const WidgetHome: React.FC<Props> = ({}) => {
  const [data, setData] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SNAKE_API_ROUTE}/article`)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error: Response) => {
        setError(error.status);
      });
  }, []);

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

  return (
    <LayoutComponent>
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
