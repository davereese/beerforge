import React, { useState, useEffect } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, HopInterface } from '../../../Store/BrewContext';
import { oz2g } from '../../../resources/javascript/calculator';

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

const BrewHops = (props: Props) => {
  const containerRef: any = React.useRef();
  const {brew, newBrew, readOnly, unitLabels, openSideBar, user, brewdayResults, updateBrew} = props;
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
    brew.hops[index].weight = +event.currentTarget.value;
    updateBrew(brew);
  }

  const getHopWeight = (weight: number = 0): number => {
    return user.units === 'metric' ? parseFloat(oz2g(weight).toFixed(2)) : weight
  }

  return (
    <Card color="brew" customClass={`${newBrew ? styles.new : brewdayResults ? styles.res : styles.view} ${styles.brew__editingSection}`}>
      <div className={styles.brew__header}>
        <h2>Hops</h2>
        {brew && brew.hops.length > 0 && !brewdayResults
          ? <span>
              Total: {getHopWeight(brew.totalHops)} {unitLabels.smallWeight}
            </span>
          : null}
        {!readOnly && !brewdayResults
          ? <button
              className={`button button--icon plus ${styles.editButton}`}
              onClick={openSideBar('hops')}
            ><span>Edit</span></button>
          : null}
      </div>
      <List customClass={`${styles.brew__ingredients} ${styles.hops}`}>
        {brew && brew.hops.map((hop: HopInterface, index: number) => (
          <ListItem
            color="brew"
            clicked={!readOnly && !brewdayResults ? openSideBar('hops', {...hop, index: index + 1}) : null}
            key={`${hop.id}${index}`}
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
              {editing === index
                ? <input
                    type="number"
                    step="0.1"
                    defaultValue={getHopWeight(hop.weight)}
                    onChange={weightUpdated(index)}
                    className={componentStyles.amountEditor}
                    ref={containerRef}
                    autoFocus
                  />
                : getHopWeight(hop.weight) + ' '
              }
              {unitLabels.smallWeight}
            </span>
            <span className={styles.secondCol}>{hop.name ? hop.name : hop.custom}</span>
            <span className={styles.thirdCol}>{hop.alphaAcid ? `${hop.alphaAcid}% AA` : null}</span>
            <span className={styles.fourthCol}>
              {hop.lengthInBoil
              && hop.use === 'boil' ? `${hop.lengthInBoil} min` : null}
              {hop.days ? `${hop.days} days` : null}
            </span>
            <span className={styles.fifthCol}>
              {hop.ibu && hop.ibu !== Infinity ? <>{hop.ibu} IBU</> : null}
            </span>
            <span className={styles.sixthCol}>
              {hop.use ? <div style={{textTransform: 'capitalize'}}>{hop.use}</div> : null}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default BrewHops;