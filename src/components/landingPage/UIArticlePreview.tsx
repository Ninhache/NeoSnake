import { NavLink } from "react-router-dom";
import { BlogPostPreview } from "../../@types/BlogPosts";
import { parseDateTime } from "../../lib/time";

type Props = {
  article: BlogPostPreview;
};

const UIArticlePreview: React.FC<Props> = ({ article }) => {
  const { title, path, abstract, date, image, authorName } = article;

  return (
    <>
      <article className="bg-gray-800 custom-width m-2 rounded-lg overflow-hidden group flex">
        <NavLink to={`/article/${path}`} className="w-full">
          <div className="flex gap-3 flex-col h-full">
            <div className="overflow-hidden">
              <img
                src={`${import.meta.env.VITE_SNAKE_API_ROUTE}/${image}`}
                alt={title}
                className="h-52 w-full object-cover transform transition-transform group-hover:scale-110"
              />
            </div>
            <div className="mx-5 mt-2 mb-5 h-full flex flex-col ">
              <div className="h-full">
                <h1 className="text-center font-bold ">{title}</h1>
                <p className="text-gray-400 mt-4">{abstract}</p>
              </div>

              <p className="bg-blue-950 p-2 rounded-md">
                Written by {authorName} on {parseDateTime(date, "en-EN")}
              </p>
            </div>
          </div>
        </NavLink>
      </article>
    </>
  );
};

export default UIArticlePreview;
