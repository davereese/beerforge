import React, { useState } from "react";

import styles from './Info.module.scss';
import infoImage from "../../resources/images/info.svg";
import Tooltip from "../Tooltip/Tooltip";

interface Props {
  alignment: 'bottom' | 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top' | 'top-center' | 'top-right' | 'top-left';
  info: string;
};

function Info({ alignment, info }: Props) {
  const [showTooltip, setTooltip] = useState(false);

  return (
    <span className={styles.container}>
      <img
        src={infoImage}
        className={styles.info}
        alt="info"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      />
      <Tooltip
        show={showTooltip}
        placement={alignment}
        onClose={() => setTooltip(false)}
      >{info}</Tooltip>
    </span>
  );
}

export default Info;