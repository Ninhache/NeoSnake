import { useEffect, useState } from "react";
import { BlogPostPreview } from "../../@types/BlogPosts";
import UIArticlePreview from "../UI/UIArticlePreview";
import LayoutComponent from "../layouts/LayoutComponent";

type Props = {};
const WidgetHome: React.FC<Props> = ({}) => {
  const [data, setData] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`${import.meta.env.VITE_SNAKE_API_ROUTE}/articles`)
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
    };
    fetchData();
  }, []);

  if (error !== null) {
    return <LayoutComponent>Error</LayoutComponent>;
  }

  if (loading) {
    return <LayoutComponent>Loading...</LayoutComponent>;
  }

  return (
    <LayoutComponent>
      {data.map((post) => (
        <UIArticlePreview article={post} key={post.id} />
      ))}
      ;
    </LayoutComponent>
  );
};

export default WidgetHome;
