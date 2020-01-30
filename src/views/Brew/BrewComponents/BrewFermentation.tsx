import React, { useState } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import { BrewInterface, FermentationInterface } from '../../../Store/BrewContext';
import { f2c, c2f, OG, FG } from '../../../resources/javascript/calculator';
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

const BrewFermentation = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user, brewdayResults, applyEdit, originalBrew} = props;

  const [editing, setEditing] = useState(false);

  const editValue = (array: {value: any, choice: string, index: number | null}[]) => {
    const editedBrew = {...brew};
    array.forEach(change => {
      let data;
      if (change.choice === 'stageTemp') {
        data = user.units === 'metric' ? Number(c2f(change.value)) : Number(change.value);
      } else {
        data = change.value;
      }
      if (change.index !== null && editedBrew.fermentation) {
        editedBrew.fermentation[change.index][change.choice] = data;
      } else {
        editedBrew[change.choice] = data;
      }
    });
    applyEdit(editedBrew);
  }

  const utilityProps = {
    editValue,
    editing,
    setEditing,
    brewdayResults
  }

  return (
    <div className={`${styles.brew__section} ${styles.mash} ${styles.fermentation}`}>
      <div className={styles.brew__header}>
        <h2>Fermentation</h2>
        {!readOnly && !brewdayResults
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('fermentation')}
            ><span>Edit</span></button>
          : null}
      </div>
      <div className={styles.section__stats}>
        <div className={styles.brew__stat}>
          <div>
            <span className={styles.value}>
              <BrewEditableField
                fieldName="og"
                value={brew.og ? Number(brew.og).toFixed(3) : null}
                classes={`${componentStyles.editInputCenter} ${componentStyles.editInputMedium}`}
                calculate={() => {
                  const value = OG(brew.fermentables, brew.mashEfficiency, brew.batchSize);
                  editValue([{value: value, choice: 'og', index: null}]);
                }}
                {...utilityProps}
              />
              {originalBrew !== null && Number(originalBrew.og).toFixed(3) !== Number(brew.og).toFixed(3) &&
                <span className={componentStyles.originalValue}>
                  <strong>{originalBrew.og}</strong>
                </span>}
            </span>
            <label className={styles.label}>OG</label>
          </div>
        </div>
        <span className={styles.arrow}></span>
        <div className={styles.brew__stat}>
          <div>
            <span className={styles.value}>
              <BrewEditableField
                fieldName="fg"
                value={brew.fg ? Number(brew.fg).toFixed(3) : null}
                classes={`${componentStyles.editInputCenter} ${componentStyles.editInputMedium}`}
                calculate={() => {
                  const value = FG(brew.og, brew.attenuation);
                  editValue([{value: value, choice: 'fg', index: null}]);
                }}
                {...utilityProps}
              />
              {originalBrew !== null && Number(originalBrew.fg).toFixed(3) !== Number(brew.fg).toFixed(3) &&
                <span className={componentStyles.originalValue}>
                  <strong>{originalBrew.fg}</strong>
                </span>}
            </span>
            <label className={styles.label}>FG</label>
          </div>
        </div>
      </div>
      {brew && brew.fermentation && brew.fermentation.map((stage: FermentationInterface, index: number) => {
        const originalStage = originalBrew !== null && originalBrew.fermentation !== undefined
          ? {...originalBrew.fermentation[index]}
          : null;
        return (
        <div
          key={`stage${index + 1}`} className={`${styles.fermentation_stage} ${index === 0 && styles.first}`}
          onClick={!readOnly && !brewdayResults ? openSideBar('fermentation', {...stage, index: index + 1}) : () => null}
        >
          <label className={styles.fermentation_label}>
            {stage.stageName ? stage.stageName.toUpperCase() : ''}
          </label>
          <div className={`${styles.section__values} ${styles.withStats}`}>
            <span>
              {stage.stageLength
                ? <>Length: <strong>
                    <BrewEditableField
                      fieldName="stageLength"
                      value={stage.stageLength}
                      label=" days"
                      {...utilityProps}
                      editValue={(value: any, fieldName: any) => {
                        editValue([{value: value, choice: fieldName, index: index}])
                      }}
                    /></strong>
                    {originalStage !== null && Number(originalStage.stageLength) !== Number(stage.stageLength) &&
                      <span className={componentStyles.originalValue}>
                        Length: <strong>{originalStage.stageLength} days</strong>
                      </span>}
                  </>
                : null}
            </span>
            <span>
              {stage.stageTemp
                ? <>Temp: <strong>
                    <BrewEditableField
                      fieldName="stageTemp"
                      value={user.units === 'metric'
                        ? parseFloat(f2c(stage.stageTemp).toFixed(1))
                        : stage.stageTemp}
                      label={` °${unitLabels.temp}`}
                      {...utilityProps}
                      editValue={(value: any, fieldName: any) => {
                        editValue([{value: value, choice: fieldName, index: index}])
                      }}
                    />
                    </strong>
                    {originalStage !== null && Number(originalStage.stageTemp).toFixed(1) !== Number(stage.stageTemp).toFixed(1) &&
                      <span className={componentStyles.originalValue}>
                        Temp: <strong>{user.units === 'metric'
                        ? parseFloat(f2c(originalStage.stageTemp).toFixed(1))
                        : originalStage.stageTemp} °{unitLabels.temp}</strong>
                      </span>}
                  </>
                : null}
            </span>
          </div>
        </div>
        );
      }
      )}
    </div>
  );
}

export default BrewFermentation;