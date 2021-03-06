import React, { useState, useEffect } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, AdjunctInterface } from '../../../store/BrewContext';
import { getAdjunctById } from '../../../resources/javascript/functions';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
  brewdayResults: boolean;
  updateBrew: Function;
}

const BrewAdjuncts = (props: Props) => {
  const containerRef: any = React.useRef();
  const {brew, newBrew, readOnly, openSideBar, brewdayResults, updateBrew} = props;
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

  const handleEditToggle = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readOnly && !brewdayResults) {
      setEditing(index);
    }
  }

  const weightUpdated = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    brew.adjuncts[index].amount = +event.currentTarget.value;
    updateBrew(brew);
  }

  return (
    <Card color="brew" customClass={`
    ${newBrew && styles.new}
    ${brewdayResults && styles.res}
    ${isDraft && styles.draft}
    ${!newBrew && !brewdayResults && !isDraft && styles.view}
  `}>
      <div className={styles.brew__header}>
        <h2>Adjuncts</h2>
        {!readOnly && !brewdayResults
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
            clicked={!readOnly && !brewdayResults ? openSideBar('adjuncts', {...adjunct, index: index + 1}) : null}
            key={`${adjunct.id}${index}`}
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
              {(!!adjunct.amount || adjunct.amount === 0) && (
                editing === index
                  ? <input
                      type="number"
                      step="0.1"
                      defaultValue={adjunct.amount}
                      onChange={weightUpdated(index)}
                      className={componentStyles.amountEditor}
                      ref={containerRef}
                      autoFocus
                    />
                  : adjunct.amount + ' '
              )}
              {(!!adjunct.amount || adjunct.amount === 0) && adjunct.units}
            </span>
            <span className={styles.secondCol}>{adjunct.name ? adjunct.name : adjunct.custom}</span>
            <span className={styles.thirdCol}>
              {!!adjunct.time || adjunct.time === 0
                ? `${adjunct.time} ${adjunct.use === 'mash' || adjunct.use === 'boil'
                  ? 'min'
                  : 'days'}`
                : null}
            </span>
            <span className={styles.fourthCol}>{adjunct.use}</span>
            <span className={styles.sixthCol}>{getAdjunctById(adjunct.category)}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default BrewAdjuncts;