import React from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, YeastInterface } from '../../../store/BrewContext';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
  brewdayResults: boolean;
}

const BrewYeast = (props: Props) => {
  const {brew, newBrew, readOnly, openSideBar, brewdayResults} = props;
  const { isDraft } = brew;
  return (
    <Card color="brew" customClass={`
    ${newBrew && styles.new}
    ${brewdayResults && styles.res}
    ${isDraft && styles.draft}
    ${!newBrew && !brewdayResults && !isDraft && styles.view}
  `}>
      <div className={styles.brew__header}>
        <h2>Yeast</h2>
        {brew && brew.yeast.length > 0 && !brewdayResults
          ? <span>{brew.pitchCellCount} bn cells {brew.targetPitchingCellCount
              ? <>of {brew.targetPitchingCellCount} bn target</>
              : null}
            </span>
          : null}
        {!readOnly && !brewdayResults
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
            clicked={!readOnly && !brewdayResults ? openSideBar('yeast', {...item, index: index + 1}) : null}
            key={`${item.id}${index}`}
            customClass={componentStyles.ingredientListItem}
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