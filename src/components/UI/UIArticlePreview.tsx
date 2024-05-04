import { NavLink } from "react-router-dom";
import { BlogPostPreview } from "../../@types/BlogPosts";
import { parseDateTime } from "../../lib/date";

type Props = {
  article: BlogPostPreview;
};

const UIArticlePreview: React.FC<Props> = ({ article }) => {
  const { title, path, abstract, date, image, authorname } = article;

  return (
    <>
      <article className="bg-gray-900 custom-width m-2 rounded-lg overflow-hidden group">
        <NavLink to={`/article/${path}`}>
          <div className="flex gap-3 flex-col ">
            <div className="overflow-hidden">
              <img
                src={`${import.meta.env.VITE_SNAKE_API_ROUTE}/${image}`}
                alt={title}
                className="h-52 w-full object-cover transform transition-transform group-hover:scale-110"
              />
            </div>
            <div className="m-5">
              <h1 className="text-center font-bold ">
                Blabla lorem ispum {title} ipsum dolor sit amet
              </h1>
              <p className="text-gray-400 my-4">{abstract}</p>
              <p className="bg-blue-950 p-2 rounded-md">
                Written by {authorname} on {parseDateTime(date, "en-EN")}
              </p>
            </div>
          </div>
        </NavLink>
      </article>
    </>
  );
};

export default UIArticlePreview;
