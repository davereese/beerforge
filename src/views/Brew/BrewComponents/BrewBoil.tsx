import React, { useState } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import { BrewInterface, MashInterface } from '../../../Store/BrewContext';
import { gal2l, l2gal } from '../../../resources/javascript/calculator';
import BrewEditableField from './BrewEditableField';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
  brewdayResults: boolean;
  applyEdit: Function;
  originalBrew: BrewInterface | null;
}

const BrewBoil = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user, brewdayResults, applyEdit, originalBrew} = props;

  const [editing, setEditing] = useState(false);

  const editValue = (value: any, choice: string) => {
    const editedBrew = {...brew};
    let data;
    switch (choice) {
      case 'topOff':
      case 'preBoilVolume':
        data = user.units === 'metric' ? l2gal(value) : value;
        break;
      default:
        data = value
    }
    editedBrew[choice] = data;
    applyEdit(editedBrew);
  }

  const utilityProps = {
    editValue,
    editing,
    setEditing,
    brewdayResults
  }

  return (
    <div className={styles.brew__section}>
      <div className={styles.brew__header}>
        <h2>Boil</h2>
        {!readOnly && !brewdayResults
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('boil')}
            ><span>Edit</span></button>
          : null}
      </div>
      <div className={`${styles.section__values} ${styles.withStats}`}>
        <span>
          {brew.batchType === 'partialMash' && brew.preBoilVolume && brew.mash.some((item: MashInterface) => item.strikeVolume)
          ? <>Top off with <strong>
              <BrewEditableField
                fieldName="topOff"
                value={user.units === 'metric'
                  ? parseFloat(gal2l(brew.topOff).toFixed(2))
                  : brew.topOff}
                label={` ${unitLabels.vol}`}
                {...utilityProps}
              />
              </strong><br />
              {originalBrew !== null && originalBrew.topOff !== brew.topOff &&
                <span className={componentStyles.originalValue}>
                  Top off with <strong>{originalBrew.topOff} {unitLabels.vol}</strong>
                </span>}
            </>
          : null}
          {brew.preBoilVolume
            ? <>{brew.batchType === 'partialMash' ? 'Total volume' : 'Volume'}: <strong>
                <BrewEditableField
                  fieldName="preBoilVolume"
                  value={user.units === 'metric'
                    ? parseFloat(gal2l(brew.preBoilVolume).toFixed(2))
                    : brew.preBoilVolume}
                  label={` ${unitLabels.vol}`}
                  {...utilityProps}
                />
                </strong>
                {originalBrew !== null && originalBrew.preBoilVolume !== brew.preBoilVolume &&
                <span className={componentStyles.originalValue}>
                  {brew.batchType === 'partialMash' ? 'Total volume' : 'Volume'}: <strong>{originalBrew.preBoilVolume} {unitLabels.vol}</strong>
                </span>}
              </>
            : null}
        </span>
        <span>{brew.boilLength
          ? <>Time: <strong>
              <BrewEditableField
                fieldName="boilLength"
                value={brew.boilLength}
                label=" min"
                {...utilityProps}
              />
              </strong>
              {originalBrew !== null && originalBrew.boilLength !== brew.boilLength &&
                <span className={componentStyles.originalValue}>
                  Time: <strong>{originalBrew.boilLength} min</strong>
                </span>}
            </>
          : null}</span>
        {brew.batchType !== 'partialMash'
          ? <span></span>
          : null}
        <div className={styles.section__stats}>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                <BrewEditableField
                  fieldName="preBoilG"
                  value={brew.preBoilG ? Number(brew.preBoilG).toFixed(3) : null}
                  classes={`${componentStyles.editInputCenter} ${componentStyles.editInputMedium}`}
                  {...utilityProps}
                />
              </span>
              {originalBrew !== null && Number(originalBrew.preBoilG).toFixed(3) !== Number(brew.preBoilG).toFixed(3) &&
                <span className={componentStyles.originalValue}>
                  <strong>{originalBrew.preBoilG}</strong>
                </span>}
              <label className={styles.label}>PRE</label>
            </div>
          </div>
          <span className={styles.arrow}></span>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                <BrewEditableField
                  fieldName="og"
                  value={brew.og ? Number(brew.og).toFixed(3) : null}
                  classes={`${componentStyles.editInputCenter} ${componentStyles.editInputMedium}`}
                  {...utilityProps}
                />
              </span>
              {originalBrew !== null && Number(originalBrew.og).toFixed(3) !== Number(brew.og).toFixed(3) &&
                <span className={componentStyles.originalValue}>
                  <strong>{originalBrew.og}</strong>
                </span>}
              <label className={styles.label}>OG</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrewBoil;