import * as React from "react";
import { linkCard } from "./ILinkCardsProps";
import styles from "./LinkCards.module.scss";

const Card: React.FC<linkCard> = (props) => {
  const {
    CardSize,
    BackgroundColor,
    Image,
    Tool,
    Title,
    LabelButton,
    ButtonLink,
    TargetButton,
  } = props;

  const objectImage = JSON.parse(Image);
  const imageURL = objectImage.serverUrl + objectImage.serverRelativeUrl;

  const handleRedirect = (link: string, target: string): void => {
    window.open(link, target);
  };

  return (
    <div className={`p-2 ${CardSize}`}>
      <div
        className={` ${styles.card} ${
          BackgroundColor === null
            ? styles.default
            : BackgroundColor === "bg_1"
            ? styles.bg_1
            : BackgroundColor === "bg_2"
            ? styles.bg_2
            : BackgroundColor === "bg_3"
            ? styles.bg_3
            : BackgroundColor === "bg_4"
            ? styles.bg_4
            : styles.default
        }`}
      >
        <div className={styles.image__container}>
          <img src={imageURL} alt={objectImage.fileName} />
        </div>
        <div className={styles.info__container}>
          <div className="p1 text-center">
            <h1>{Tool.toUpperCase()}</h1>
          </div>
          <div>
            <div className={styles.info__description} title={Title}>
              <h2>{Title.toUpperCase()}</h2>
            </div>
            <div className="d-flex justify-content-center pt-3">
              <h2>
                <a
                  onClick={() => handleRedirect(ButtonLink, TargetButton)}
                  className={styles.card__button}
                >
                  {LabelButton}
                </a>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
