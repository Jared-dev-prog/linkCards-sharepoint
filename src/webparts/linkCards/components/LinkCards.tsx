import * as React from "react";
// import styles from './LinkCards.module.scss';
import type { ILinkCardsProps, InfoPage, linkCard } from "./ILinkCardsProps";

import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import Card from "./Card";
import styles from "./LinkCards.module.scss";
import { ITEM_PER_PAGE } from "../constants/routes";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";

const LinkCards: React.FC<ILinkCardsProps> = (props) => {
  const options = [
    {
      value: 10,
    },
    {
      value: 15,
    },
    {
      value: 20,
    },
    {
      value: 25,
    },
  ];
  const { nameList, absoluteUrl } = props;
  const [error, setError] = React.useState<string>(
    "Es necesario crear una lista en el contenido de este sitio con las siguientes columnas: Tool, Title, Image, Card Size, Background Color, Label Button, Target Button, Button Link, Order. Agregue el nombre de la lista en el panel de propiedades del componente."
  );
  const [linkCardsOrigin, setLinkCardsOrigin] = React.useState<linkCard[]>([]);
  const [linkCards, setLinkCards] = React.useState<linkCard[]>([]);
  const [infoPage, setInfoPage] = React.useState<InfoPage>({
    items: [],
    itemsOffset: 0,
    itemsPerPage: ITEM_PER_PAGE,
    endOffset: 0,
    pageCount: 0,
    itemsTotal: 0,
    pageActual: 0,
    itemInit: 0,
    itemSecond: 0,
  });
  const [itemPerPage, setItemPerPage] = React.useState<string>(
    ITEM_PER_PAGE.toString()
  );
  const [messageEmptyList, setMessageEmptyList] = React.useState<string>("");
  const getInitList = (
    listOrigin: linkCard[],
    Offset: number = 0,
    itemsPerPage: number = ITEM_PER_PAGE
  ): void => {
    setInfoPage({
      items: [],
      itemsOffset: Offset,
      itemsPerPage: itemsPerPage,
      endOffset: Offset + itemsPerPage,
      pageCount: Math.ceil(listOrigin.length / itemsPerPage),
      itemsTotal: listOrigin.length,
      pageActual: 1,
      itemInit: 1,
      itemSecond:
        listOrigin.length <= itemsPerPage ? listOrigin.length : itemsPerPage,
    });
    const currentItems = listOrigin.slice(Offset, Offset + itemsPerPage);
    setLinkCards(currentItems);
  };
  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setItemPerPage(event.target.value);
    getInitList(linkCardsOrigin, 0, +event.target.value);
  };

  const _getPage = (page: number): void => {
    const offset = (page - 1) * Number(itemPerPage);
    const limit = page * Number(itemPerPage);
    const currentItems = linkCardsOrigin.slice(offset, limit);
    setLinkCards(currentItems);
    setInfoPage({
      ...infoPage,
      pageActual: page,
      itemInit: offset + 1,
      itemSecond: (page - 1) * Number(itemPerPage) + currentItems.length,
    });
  };

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
        const listOrder = response.sort((a, b) => a.Order0 - b.Order0);
        setLinkCardsOrigin(listOrder);
        getInitList(listOrder, 0, ITEM_PER_PAGE);
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
      <div className={`d-flex`}>
        <div className={styles.padding_right}>Registros por pagina</div>
        <div>
          <select value={itemPerPage} onChange={handleSelectChange}>
            {/* Opciones del select */}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.d__paginator}>
        <div className={styles.padding_right}>
          Mostrando {infoPage.itemInit} - {infoPage.itemSecond} de{" "}
          {infoPage.itemsTotal}
        </div>
        <Pagination
          currentPage={1}
          totalPages={infoPage.pageCount}
          onChange={(page) => _getPage(page)}
          limiter={3}
        />{" "}
      </div>
    </section>
  );
};

export default LinkCards;
