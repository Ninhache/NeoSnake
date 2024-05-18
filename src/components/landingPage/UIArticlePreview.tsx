import { NavLink } from "react-router-dom";
import { BlogPostPreview } from "../../@types/BlogPosts";
import { parseDateTime } from "../../lib/time";
import { capitalize } from "../../lib/text";

type Props = {
  article: BlogPostPreview;
};

const UIArticlePreview: React.FC<Props> = ({ article }) => {
  const {
    title,
    path,
    abstract,
    date,
    image,
    authorName,
    authorImage,
    tags,
    readTime,
  } = article;

  return (
    <>
      <article className="bg-gray-800 bg-opacity-60 custom-width m-2 rounded-lg overflow-hidden group flex">
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
              <div className="flex flex-grow justify-center gap-2 mb-2">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-red-400 border-2 bg-opacity-40 border-red-500 p-1 font-bold rounded-md text-xs mr-1"
                  >
                    {capitalize(tag)}
                  </span>
                ))}
              </div>
              <div className="flex bg-gray-800 bg-opacity-60 p-2 rounded-md items-center gap-2">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={`${import.meta.env.VITE_SNAKE_API_ROUTE}/${authorImage}`}
                ></img>
                <div>
                  <p className="text-sm font-bold">{authorName}</p>
                  <p className="text-gray-500">
                    {parseDateTime(date, "en-EN")} - {readTime} min read
                  </p>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      </article>
    </>
  );
};

export default UIArticlePreview;
