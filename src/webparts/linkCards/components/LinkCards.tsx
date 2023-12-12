import * as React from "react";
// import styles from './LinkCards.module.scss';
import type { ILinkCardsProps, linkCard } from "./ILinkCardsProps";

import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import Card from "./Card";
import styles from "./LinkCards.module.scss";

const LinkCards: React.FC<ILinkCardsProps> = (props) => {
  const { nameList, absoluteUrl } = props;
  const [error, setError] = React.useState<string>(
    "Es necesario crear una lista llamada 'linkCards' en el contenido de este sitio con las siguientes columnas: Tool, Title, Image, Card Size, Background Color, Label Button, Target Button, Button Link, Order. Agregue el nombre de la lista en el panel de propiedades del componente."
  );
  const [linkCards, setLinkCards] = React.useState<linkCard[]>([]);
  const [messageEmptyList, setMessageEmptyList] = React.useState<string>("");
  console.log(nameList);
  console.log(absoluteUrl);

  React.useEffect(() => {
    sp.setup({
      sp: {
        baseUrl: absoluteUrl,
      },
    });

    sp.web.lists
      .getByTitle(nameList)
      .items.get()
      .then((response) => {
        console.log(response);
        const listOrder = response.sort((a, b) => a.Order0 - b.Order0);
        console.log(listOrder);
        setLinkCards(listOrder);
        setError("");

        if (response.length === 0) {
          setMessageEmptyList("La lista esta vacía");
        } else {
          setMessageEmptyList("");
        }
      })
      .catch(() => {
        if (nameList !== "") {
          const message = `La lista "${nameList}" no existe en el sitio`;
          setError(message);
        }
      });
  }, [nameList]);

  return (
    <section className={`${styles.container} row`}>
      {error === "" ? null : error}
      {linkCards.length !== 0 ? (
        linkCards.map((card) => (
          <Card
            key={card.Id}
            Id={card.Id}
            Tool={card.Tool}
            Title={card.Title}
            Image={card.Image}
            BackgroundColor={card.BackgroundColor}
            LabelButton={card.LabelButton}
            CardSize={card.CardSize}
            TargetButton={card.TargetButton}
            ButtonLink={card.ButtonLink}
            baseUrl={absoluteUrl}
          />
        ))
      ) : (
        <div>{messageEmptyList}</div>
      )}
    </section>
  );
};

export default LinkCards;
