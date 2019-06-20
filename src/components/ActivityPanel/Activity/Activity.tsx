import React, { useState } from 'react';

import styles from './Activity.module.scss';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';
import Tooltip from '../../Tooltip/Tooltip';

interface Props {
  srm: number | null;
  brews: Array<string>;
  date: string;
}

function Activity({
  srm,
  brews,
  date,
}: Props) {
  const [showTooltip, setTooltip] = useState(false);

  const separator = brews.length > 0 ? '| ' : '';
  let title = brews.map((element, i) => {
    return <span key={i}>{element}</span>;
  });

  const color = srm && srm > 0 ? {backgroundColor: getSrmToRgb(srm)} : {backgroundColor: '#f4d03f'};

  return(
    <>
      <div
        className={styles.Activity}
        style={srm !== null ? color : undefined}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
      <Tooltip
        show={showTooltip}
        placement={'bottom'}
        onClose={() => {}}
        className={styles.tooltip}
      >{title}{separator + date}</Tooltip>
      </div>
    </>
  );
};

export default Activity;