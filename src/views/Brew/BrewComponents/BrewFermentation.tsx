import React, { useState } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import { BrewInterface, FermentationInterface } from '../../../Store/BrewContext';
import { f2c, c2f } from '../../../resources/javascript/calculator';
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
}

const BrewFermentation = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user, brewdayResults, applyEdit} = props;

  const [editing, setEditing] = useState(false);

  const editValue = (value: any, choice: string, index: number | null = null) => {
    const editedBrew = {...brew};
    let data;
    if (choice === 'stageTemp') {
      data = user.units === 'metric' ? Number(c2f(value)) : Number(value);
    } else {
      data = value;
    }
    if (index !== null && editedBrew.fermentation) {
      editedBrew.fermentation[index][choice] = data;
    } else {
      editedBrew[choice] = data;
    }
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
                {...utilityProps}
              />
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
                {...utilityProps}
              />
            </span>
            <label className={styles.label}>FG</label>
          </div>
        </div>
      </div>
      {brew && brew.fermentation && brew.fermentation.map((stage: FermentationInterface, index: number) => (
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
                      editValue(value, fieldName, index)
                    }}
                  />
                  </strong></>
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
                        editValue(value, fieldName, index)
                      }}
                    />
                    </strong>
                  </>
                : null}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BrewFermentation;