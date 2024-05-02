import { useParams } from "react-router-dom";
import LayoutComponent from "../layouts/LayoutComponent";
import { BlogPostPreview } from "../../@types/BlogPosts";
import { useEffect, useState } from "react";
import { Nullable } from "../../@types/NullableType";
import infoIcon from "../../assets/svg/info_icon.svg";
import UINotification from "../UI/UINotification";

type Props = {};
const WidgetArticle: React.FC<Props> = ({}) => {
  const params = useParams();

  const [data, setData] = useState<Nullable<BlogPostPreview>>(null);
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
    return <LayoutComponent>Loading...</LayoutComponent>;
  }

  if (!data) {
    return (
      <LayoutComponent>
        L'article que vous cherchez n'a pas été trouvé, veuillez contacter
        l'administrateur du site si vous pensez que c'est une erreur.
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      {wrongId && (
        <UINotification type="info">
          L'article demandé n'a pas été trouvé, nous avons fait notre possible
          pour vous finir le meilleur résultat possible
        </UINotification>
      )}
      <h1>{data.title}</h1>
      <p>{data.date}</p>
      <p>{data.abstract}</p>
      <img src={data.image} alt={data.title} />
    </LayoutComponent>
  );
};

export default WidgetArticle;
