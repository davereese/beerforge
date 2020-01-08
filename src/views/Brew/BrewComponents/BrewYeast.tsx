import React from 'react';

import styles from '../Brew.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, YeastInterface } from '../../../Store/BrewContext';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewYeast = (props: Props) => {
  const {brew, newBrew, readOnly, openSideBar} = props;
  return (
    <Card color="brew" customClass={`${newBrew ? styles.new : styles.view} ${styles.brew__editingSection}`}>
      <div className={styles.brew__header}>
        <h2>Yeast</h2>
        {brew && brew.yeast.length > 0
          ? <span>{brew.pitchCellCount} bn cells {brew.targetPitchingCellCount
              ? <>of {brew.targetPitchingCellCount} bn target</>
              : null}
            </span>
          : null}
        {!readOnly
          ? <button
              className={`button button--icon plus ${styles.editButton}`}
              onClick={openSideBar('yeast')}
            ><span>Edit</span></button>
          : null}
      </div>
      <List customClass={`${styles.brew__ingredients} ${styles.yeast}`}>
        {brew && brew.yeast.map((item: YeastInterface, index: number) => (
          <ListItem
            color="brew"
            clicked={!readOnly ? openSideBar('yeast', {...item, index: index + 1}) : null}
            key={`${item.id}${index}`}
          >
            <span className={styles.firstCol}>
              {item.amount} {item.units === 'cells' ? 'bn cells' : item.units}
            </span>
            <span className={styles.secondCol}>
              {item.manufacturer ? `${item.manufacturer} - ` : null}{item.name ? item.name : item.custom}
            </span>
            <span className={styles.thirdCol}>{item.averageAttenuation}% average attenuation</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default BrewYeast;