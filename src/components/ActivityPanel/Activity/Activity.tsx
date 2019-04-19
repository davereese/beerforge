import React from 'react';

import styles from './Activity.module.scss';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';

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

  const separator = brews.length > 0 ? ' - ' : '';
  const title = brews.join(', ') + separator + date;

  const color = {
    backgroundColor: getSrmToRgb(srm),
  };

  return(
    <div className={styles.Activity} title={title} style={srm ? color : undefined} />
  );
};

export default Activity;