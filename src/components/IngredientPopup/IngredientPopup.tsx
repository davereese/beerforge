import React, { useEffect, useState } from 'react';
import { usePopup } from '../../store/PopupContext';
import FlavorGraph from './IngredientGraph';

import styles from "./IngredientPopup.module.scss"

function IngredientPopup() {
  const {state: popup, dispatch: popupDispatch} = usePopup();
  const [hovering, setHovering] = useState<boolean>(false);
  const popupRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (popup.closing && hovering) {
      popupDispatch({type: 'cancelHide'});
    } else if (popup.closing && !hovering) {
      popupDispatch({type: 'close'});
    }
  }, [popup, popupDispatch, hovering]);

  return popup && popup.show && popup.coords ? (
    <div
      ref={popupRef}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      className={styles.ingredientPopup}
      style={{top: `${popup.coords.top}px`, left: `${popup.coords.left - 592}px`}}
    >
      <div className={styles.details}>
        <h1 className={`${styles.ingredientName} ${popup.ingredient?.category}`}>{popup.ingredient?.name}</h1>
        <h2 className={styles.ingredientDetails}>
          {popup.ingredient?.details?.map((detail: string) => (<span key={detail}>{detail}</span>))}
        </h2>
        <p className={styles.description}>{popup.ingredient?.description}</p>
      </div>
      <div className={styles.graph}>
        {popup.ingredient && <FlavorGraph graphData={popup.ingredient?.graph} />}
      </div>
    </div>
  ) : null;
};

export default IngredientPopup;