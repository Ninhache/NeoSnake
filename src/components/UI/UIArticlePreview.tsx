import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BlogPostPreview } from "../../@types/BlogPosts";
import LayoutComponent from "../layouts/LayoutComponent";

type Props = {
  article: BlogPostPreview;
};

const UIArticlePreview: React.FC<Props> = ({ article }) => {
  const { title, path, abstract, date, image } = article;
  // @ts-expect-error
  const [isActive, setActive] = useState(false);

  return (
    <>
      <LayoutComponent>
        <NavLink to={`/article/${path}`}>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center p-4 m-4 border border-gray-200 rounded-lg shadow-md">
              <img src={image} alt={title} className=" rounded-lg" />
              <h2 className="mt-4 text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-gray-500">{date}</p>
              <p className="mt-2 text-base">{abstract}</p>

              <div className="mt-4 text-blue-500 underline">Lire la suite</div>
            </div>
          </div>
        </NavLink>
      </LayoutComponent>
    </>
  );
};

export default UIArticlePreview;
