import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {useParams} from "react-router-dom";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import {BlogPost} from "../../@types/BlogPosts";
import {Nullable} from "../../@types/NullableType";
import UINotification from "../UI/UINotification";
import LayoutComponent from "../layouts/LayoutComponent";

import "../../styles/markdown.css";
import UISuspense from "../UI/UISuspense";
import rehypeRaw from "rehype-raw";

type Props = {};
const WidgetArticle: React.FC<Props> = ({}) => {
  const params = useParams();

  const [data, setData] = useState<Nullable<BlogPost>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wrongId, setWrongId] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SNAKE_API_ROUTE}/article/${params.id}`)
      .then((response) => {
        if (response.status === 404) {
          setWrongId(true);
          return response;
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <LayoutComponent>
        <UISuspense />
      </LayoutComponent>
    );
  }

  if (!data) {
    return (
      <LayoutComponent>
          The article you are looking for was not found, please contact the site administrator if you think this is an error.
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      {wrongId && (
        <UINotification type="info">
            The requested article was not found, we did our best to provide you with the best possible result.
        </UINotification>
      )}
      <div ref={(r) => r?.scrollIntoView({ behavior: "smooth" })}></div>
      <ReactMarkdown
        className={`markdown`}
        skipHtml={false}
        urlTransform={(url) => {
          if (url.startsWith("http")) {
            return url;
          }
          return `${import.meta.env.VITE_SNAKE_API_ROUTE}/${url}`;
        }}
        rehypePlugins={[
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeHighlight,
          rehypeRaw,
        ]}
      >
        {data.content}
      </ReactMarkdown>
    </LayoutComponent>
  );
};

export default WidgetArticle;
