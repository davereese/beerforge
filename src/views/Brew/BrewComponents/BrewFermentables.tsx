import React from 'react';

import styles from '../Brew.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, FermentableInterface } from '../../../Store/BrewContext';
import { lb2kg } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
  brewdayResults: boolean;
  originalBrew: BrewInterface | null;
}

const BrewFermentables = (props: Props) => {
  const {brew, newBrew, readOnly, unitLabels, openSideBar, user, brewdayResults, originalBrew} = props;

  const calculatedWeight = (index: number) => {
    if (brewdayResults && originalBrew) {
      return originalBrew.fermentables[index].calculatedWeight;
    } else {
      return brew.fermentables[index].calculatedWeight;
    }
  };

  return (
    <Card color="brew" customClass={`${newBrew ? styles.new : brewdayResults ? styles.res : styles.view} ${styles.brew__editingSection}`}>
      <div className={styles.brew__header}>
        <h2>Fermentables</h2>
        {brew && brew.fermentables.length > 0 && !brewdayResults
          ? <span>Total: {user.units === 'metric' ? parseFloat(lb2kg(brew.totalFermentables).toFixed(2)) : brew.totalFermentables} {unitLabels.largeWeight}{brew.totalFermentablesPercent ? ` (${brew.totalFermentablesPercent}%)` : null}</span>
          : null}
        {!readOnly && !brewdayResults
          ? <button
              className={`button button--icon plus ${styles.editButton}`}
              onClick={openSideBar('fermentables')}
            ><span>Edit</span></button>
          : null}
      </div>
      <List customClass={`${styles.brew__ingredients} ${styles.fermentables}`}>
        {brew && brew.fermentables.map((fermentable: FermentableInterface, index: number) => (
          <ListItem
            color="brew"
            clicked={!readOnly && !brewdayResults ? openSideBar('fermentables', {...fermentable, index: index + 1}) : null}
            key={`${fermentable.id}${index}`}
          >
            <span className={styles.firstCol}>
            {brew.fermentableUnits === 'percent'
              ? <>{user.units === 'metric'
                  ? parseFloat(lb2kg(calculatedWeight(index)).toFixed(2))
                  : calculatedWeight(index)} {unitLabels.largeWeight} ({fermentable.weight}%)</>
              : <>{user.units === 'metric'
                  ? parseFloat(lb2kg(fermentable.weight).toFixed(2))
                  : fermentable.weight} {unitLabels.largeWeight}</>
            }
            </span>
            <span className={styles.secondCol}>{fermentable.name ? fermentable.name : fermentable.custom}</span>
            <span className={styles.thirdCol}>{fermentable.lovibond} °L</span>
            <span className={styles.fourthCol}>{fermentable.origin}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default BrewFermentables;