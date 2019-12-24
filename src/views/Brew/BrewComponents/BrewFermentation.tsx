import React from 'react';

import styles from '../Brew.module.scss';
import { BrewInterface, FermentationInterface } from '../../../Store/BrewContext';
import { f2c } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewFermentation = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user} = props;
  return (
    <div className={`${styles.brew__section} ${styles.mash} ${styles.fermentation}`}>
      <div className={styles.brew__header}>
        <h2>Fermentation</h2>
        {!readOnly
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('fermentation')}
            ><span>Edit</span></button>
          : null}
      </div>
      <div className={styles.section__stats}>
        <div className={styles.brew__stat}>
          <div>
            <span className={styles.value}>{Number(brew.og).toFixed(3)}</span>
            <label className={styles.label}>OG</label>
          </div>
        </div>
        <span className={styles.arrow}></span>
        <div className={styles.brew__stat}>
          <div>
            <span className={styles.value}>{Number(brew.fg).toFixed(3)}</span>
            <label className={styles.label}>FG</label>
          </div>
        </div>
      </div>
      {brew && brew.fermentation && brew.fermentation.map((stage: FermentationInterface, index: number) => (
        <div
          key={`stage${index + 1}`} className={`${styles.fermentation_stage} ${index === 0 && styles.first}`}
          onClick={!readOnly ? openSideBar('fermentation', {...stage, index: index + 1}) : () => null}
        >
          <label className={styles.fermentation_label}>
            {stage.stageName ? stage.stageName.toUpperCase() : ''}
          </label>
          <div className={`${styles.section__values} ${styles.withStats}`}>
            <span>
              {stage.stageLength
                ? <>Length: <strong>{stage.stageLength} days</strong></>
                : null}
            </span>
            <span>
              {stage.stageTemp
                ? <>Temp: <strong>{
                    user.units === 'metric'
                      ? parseFloat(f2c(stage.stageTemp).toFixed(1))
                      : stage.stageTemp
                    } °{unitLabels.temp}</strong>
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