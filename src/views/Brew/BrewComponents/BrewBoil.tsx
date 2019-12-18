import React from 'react';

import styles from '../Brew.module.scss';
import { BrewInterface, MashInterface } from '../../../Store/BrewContext';
import { gal2l } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewBoil = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user} = props;
  return (
    <div className={styles.brew__section}>
      <div className={styles.brew__header}>
        <h2>Boil</h2>
        {!readOnly
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
              {user.units === 'metric' ? parseFloat(gal2l(brew.topOff).toFixed(2)) : brew.topOff} {unitLabels.vol}
            </strong><br /></>
          : null}
          {brew.preBoilVolume
            ? <>{brew.batchType === 'partialMash' ? 'Total volume' : 'Volume'}: <strong>{user.units === 'metric' ? parseFloat(gal2l(brew.preBoilVolume).toFixed(2)) : brew.preBoilVolume} {unitLabels.vol}</strong></>
            : null}
        </span>
        <span>{brew.boilLength
          ? <>Time: <strong>{brew.boilLength} min</strong></>
          : null}</span>
        {brew.batchType !== 'partialMash'
          ? <span></span>
          : null}
        <div className={styles.section__stats}>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>{brew.preBoilG}</span>
              <label className={styles.label}>PRE</label>
            </div>
          </div>
          <span className={styles.arrow}></span>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>{brew.og}</span>
              <label className={styles.label}>OG</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrewBoil;