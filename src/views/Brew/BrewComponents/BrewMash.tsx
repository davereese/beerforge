import React from 'react';

import styles from '../Brew.module.scss';
import { BrewInterface, MashInterface } from '../../../Store/BrewContext';
import { gal2l, f2c, qt2l } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewMash = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user} = props;
  return (
    <div className={`${styles.brew__section} ${styles.mash}`}>
      <div className={styles.brew__header}>
        <h2>Mash</h2>
        <span>{brew.batchType === 'BIAB' &&
          brew.totalMashVolume &&
          brew.kettleSize &&
          Number(brew.totalMashVolume) > Number(brew.kettleSize)
            ? <>Warning: Total mash volume exceeds kettle size</>
            : null}
        </span>
        {!readOnly
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('mash')}
            ><span>Edit</span></button>
          : null}
      </div>
      {brew && brew.mash.map((step: MashInterface, index: number) => (
        <div
          key={`step${index + 1}`} className={styles.mash_step}
          onClick={!readOnly ? openSideBar('mash', step) : () => null}
        >
          <label className={styles.mash_label}>
            {index + 1}: {step.type ? step.type.toUpperCase() : ''}
          </label>
          <div className={styles.section__values}>
            {step.type === 'strike'
              ? <>
                <span>
                  {step.strikeVolume && brew.batchType !== 'BIAB' && step.strikeTemp
                    ? <>Strike with <strong>{user.units === 'metric' ? parseFloat(gal2l(step.strikeVolume).toFixed(1)) : step.strikeVolume} {unitLabels.vol}</strong> at <strong>{user.units === 'metric' ? parseFloat(f2c(step.strikeTemp).toFixed(1)) : step.strikeTemp} °{unitLabels.temp}</strong></>
                    : null}
                  {brew.totalWater && brew.batchType === 'BIAB' && step.strikeTemp
                    ? <>Strike with <strong>{brew.totalWater.toFixed(2)} {unitLabels.vol}</strong> at <strong>{user.units === 'metric' ? parseFloat(f2c(step.strikeTemp).toFixed(2)) : step.strikeTemp} °{unitLabels.temp}</strong></>
                    : null}
                </span>
                <span>
                  {step.targetStepTemp
                    ? <>Mash at <strong>{user.units === 'metric' ? parseFloat(f2c(step.targetStepTemp).toFixed(1)) : step.targetStepTemp} °{unitLabels.temp}</strong></>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>{step.stepLength} min</strong></>
                    : null}
                </span>
                {brew.totalMashVolume && brew.batchType === 'BIAB'
                  ? <span>Total Mash Vol: <strong>{user.units === 'metric' ? parseFloat(gal2l(brew.totalMashVolume).toFixed(2)) : brew.totalMashVolume} {unitLabels.vol}</strong></span>
                  : null}
              </>
              : null}
            {step.type === 'temperature' || step.type === 'decoction'
              ? <>
                <span>
                  {step.targetStepTemp
                    ? <>Raise to <strong>{user.units === 'metric' ? parseFloat(f2c(step.targetStepTemp).toFixed(1)) : step.targetStepTemp} °{unitLabels.temp}</strong></>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>{step.stepLength} min</strong></>
                    : null}
                </span>
                </>
              : null}
            {step.type === 'infusion'
              ? <>
                <span>
                  {step.infusionWaterVol
                    ? <>Add <strong>{user.units === 'metric' ? parseFloat(qt2l(step.infusionWaterVol).toFixed(2)) : step.infusionWaterVol} {unitLabels.smallVol}</strong></>
                    : null}
                  {step.infusionWaterTemp
                    ? <> at <strong>{user.units === 'metric' ? parseFloat(f2c(step.infusionWaterTemp).toFixed(1)) : step.infusionWaterTemp} °{unitLabels.temp}</strong></>
                    : null}
                </span>
                <span>
                  {step.targetStepTemp
                    ? <> Bring to <strong>{user.units === 'metric' ? parseFloat(f2c(step.targetStepTemp).toFixed(1)) : step.targetStepTemp} °{unitLabels.temp}</strong></>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>{step.stepLength} min</strong></>
                    : null}
                </span>
                </>
              : null}
            {step.type === 'sparge'
              ? <span>
                {step.spargeTemp
                  ? <>Sparge&nbsp;
                    {step.spargeVolume
                      ? <>with <strong>{user.units === 'metric' ? parseFloat(gal2l(step.spargeVolume).toFixed(2)) : step.spargeVolume} {unitLabels.vol}</strong> </>
                      : null}
                    at <strong>{user.units === 'metric' ? parseFloat(f2c(step.spargeTemp).toFixed(1)) : step.spargeTemp} °{unitLabels.temp}</strong></>
                  : null}
              </span>
              : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BrewMash;