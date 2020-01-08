import React from 'react';

import styles from '../Brew.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, AdjunctInterface } from '../../../Store/BrewContext';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewAdjuncts = (props: Props) => {
  const {brew, newBrew, readOnly, openSideBar} = props;
  return (
    <Card color="brew" customClass={`${newBrew ? styles.new : styles.view} ${styles.brew__editingSection}`}>
      <div className={styles.brew__header}>
        <h2>Adjuncts</h2>
        {!readOnly
          ? <button
              className={`button button--icon plus ${styles.editButton}`}
              onClick={openSideBar('adjuncts')}
            ><span>Edit</span></button>
          : null}
      </div>
      <List customClass={`${styles.brew__ingredients} ${styles.adjuncts}`}>
        {brew && brew.adjuncts.map((adjunct: AdjunctInterface, index: number) => (
          <ListItem
            color="brew"
            clicked={!readOnly ? openSideBar('adjuncts', {...adjunct, index: index + 1}) : null}
            key={`${adjunct.id}${index}`}
          >
            <span className={styles.firstCol}>
              {adjunct.amount} {adjunct.units}
            </span>
            <span className={styles.secondCol}>{adjunct.name ? adjunct.name : adjunct.custom}</span>
            <span className={styles.thirdCol}>
              {adjunct.time
                ? `${adjunct.time} ${adjunct.use === 'mash' || adjunct.use === 'boil'
                  ? 'min'
                  : 'days'}`
                : null}
            </span>
            <span className={styles.fourthCol}>{adjunct.use}</span>
            <span className={styles.sixthCol}>{adjunct.type}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default BrewAdjuncts;