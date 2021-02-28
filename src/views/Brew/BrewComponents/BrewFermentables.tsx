import React, { useState, useEffect } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, FermentableInterface } from '../../../store/BrewContext';
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
  updateBrew: Function;
}

const BrewFermentables = (props: Props) => {
  const containerRef: any = React.useRef();
  const {brew, newBrew, readOnly, unitLabels, openSideBar, user, brewdayResults, originalBrew, updateBrew} = props;
  const { isDraft } = brew;
  const [editing, setEditing] = useState<number | undefined>(undefined);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setEditing(undefined);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      setEditing(undefined);
    }
  };

  const getFermentableWeight = (weight: number = 0): number => {
    return user.units === 'metric' ? parseFloat(lb2kg(weight).toFixed(2)) : weight
  }

  const calculatedWeight = (index: number) => {
    if (brewdayResults && originalBrew) {
      return originalBrew.fermentables[index].calculatedWeight;
    } else {
      return brew.fermentables[index].calculatedWeight;
    }
  };

  const weightUpdated = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    brew.fermentables[index].weight = +event.currentTarget.value;
    updateBrew(brew);
  }

  const handleEditToggle = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readOnly && !brewdayResults) {
      setEditing(index);
    }
  }

  return (
    <Card color="brew" customClass={`
    ${newBrew && styles.new}
    ${brewdayResults && styles.res}
    ${isDraft && styles.draft}
    ${!newBrew && !brewdayResults && !isDraft && styles.view}
  `}>
      <div className={styles.brew__header}>
        <h2>Fermentables</h2>
        {brew && brew.fermentables.length > 0 && !brewdayResults
          ? <span>Total: {getFermentableWeight(brew.totalFermentables)} {unitLabels.largeWeight}{brew.totalFermentablesPercent && ` (${brew.totalFermentablesPercent}%)`}</span>
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
            customClass={componentStyles.ingredientListItem}
          >
            <span
              className={`
                ${styles.firstCol}
                ${!readOnly && !brewdayResults && componentStyles.editable}
                ${editing === index && componentStyles.editing}
              `}
              onClick={handleEditToggle(index)}
            >
            {!!fermentable.weight && (
              brew.fermentableUnits === 'percent'
                ? <>{editing === index
                    ? <><input
                        type="number"
                        step="0.1"
                        defaultValue={getFermentableWeight(fermentable.weight)}
                        onChange={weightUpdated(index)}
                        className={componentStyles.amountEditor}
                        ref={containerRef}
                        autoFocus
                      />%</>
                    : `${getFermentableWeight(calculatedWeight(index))} ${unitLabels.largeWeight} (${fermentable.weight}%)`}
                    
                  </>
                : <>{editing === index
                    ? <input
                        type="number"
                        step="0.1"
                        defaultValue={getFermentableWeight(fermentable.weight)}
                        onChange={weightUpdated(index)}
                        className={componentStyles.amountEditor}
                        ref={containerRef}
                        autoFocus
                      />
                    : getFermentableWeight(fermentable.weight) + ' '}
                    {unitLabels.largeWeight}
                  </>
              )
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