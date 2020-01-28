import React, { useState } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import { BrewInterface, MashInterface, processOptionsInterface } from '../../../Store/BrewContext';
import { gal2l, l2gal, preBoilVol, OG, preBoilG, partialMashTopOff, lb2kg } from '../../../resources/javascript/calculator';
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
  options: processOptionsInterface;
}

const BrewBoil = (props: Props) => {
  const {
    brew,
    readOnly,
    unitLabels,
    openSideBar,
    user,
    brewdayResults,
    applyEdit,
    originalBrew,
    options
  }= props;

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
                calculate={() => {
                  const value = partialMashTopOff(
                    brew.preBoilVolume,
                    brew.mash[0].strikeVolume,
                    originalBrew && (options.units === 'metric'
                      ? lb2kg(originalBrew.totalGrainFermentables)
                      : originalBrew.totalGrainFermentables),
                    options.absorptionRate
                  );
                  editValue(value, 'topOff');
                }}
                {...utilityProps}
              />
              </strong><br />
              {originalBrew !== null && Number(originalBrew.topOff) !== Number(brew.topOff) &&
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
                  calculate={() => {
                    const value = preBoilVol(
                      originalBrew && originalBrew.totalWater,
                      originalBrew && originalBrew.totalFermentables,
                      options.equipmentLoss,
                      options.absorptionRate,
                      brew.batchType
                    );
                    editValue(value, 'preBoilVolume');
                  }}
                  {...utilityProps}
                />
                </strong>
                {originalBrew !== null && Number(originalBrew.preBoilVolume) !== Number(brew.preBoilVolume) &&
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
                  calculate={() => {
                    const value = preBoilG(
                      brew.og,
                      originalBrew && originalBrew.totalFermentables,
                      originalBrew && originalBrew.totalWater,
                      brew.batchSize,
                      options.equipmentLoss,
                      options.absorptionRate,
                      brew.batchType
                    );
                    editValue(value, 'preBoilG');
                  }}
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
                  calculate={() => {
                    const value = OG(brew.fermentables, brew.mashEfficiency, brew.batchSize);
                    editValue(value, 'og');
                  }}
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