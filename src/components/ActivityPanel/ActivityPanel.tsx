import React from 'react';

import styles from './ActivityPanel.module.scss';
import Activity from './Activity/Activity';
import { getFormattedDate } from '../FormattedDate/FormattedDate';

interface Props {
  brews: any;
}

const today = new Date();

const weeksBetween = (date1: any, date2: any) => {
  return Math.round((date2 - date1) / (7 * 24 * 60 * 60 * 1000));
}

const dateOfWeeksAgo = (date: Date, weeks: number) => {
  const dateOfWeeksAgo = new Date(date.getFullYear(), date.getMonth(), date.getDate()-(weeks*7));
  return getFormattedDate(dateOfWeeksAgo);
}

function ActivityPanel({
  brews,
}: Props) {

  const createActivity = () => {
    let weeks = [];
    for (let i = 0; i < 104; i++) {
      let color: number | null = null;
      let names: Array<string> = [];
      const weekDate = dateOfWeeksAgo(today, i);
      brews.forEach((brew: any) => {
        const weeksAgo = weeksBetween(new Date(brew.date_brewed), today);
        if (weeksAgo === i) {
          color = brew.srm ? brew.srm : 0;
          names.push(brew.name);
        }
      });
      weeks.push(<Activity key={i} date={weekDate} srm={color} brews={names} />);
    }
    return weeks.reverse();
  }

  return(
    <div className={styles.ActivityPanel}>
      <div className={styles.year}>
        {today.getFullYear() - 2}
      </div>
      <div className={styles.ActivityPanel__container}>
        {createActivity()}
      </div>
      <div className={styles.year}>
        {today.getFullYear()}
      </div>
    </div>
  );
};

export default ActivityPanel;