import React from 'react';

import styles from '../Brew.module.scss';
import Card from '../../../components/Card/Card';
import { BrewInterface } from '../../../Store/BrewContext';
import { parseStringValues } from '../BrewUtils';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';
import { gal2l } from '../../../resources/javascript/calculator';
import { pen } from '../../../resources/javascript/penSvg.js';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewSettings = (props: Props) => {
  const {brew, newBrew, readOnly, unitLabels, openSideBar, user} = props;
  return (
    <Card color="brew" customClass={newBrew? styles.newBrew: styles.view}>
      <div className={styles.brew__numbers}>
        <ul className={styles.brew__numbersList}>
          <li>
            Brew Method: {parseStringValues(brew.batchType)}
            {!readOnly
              ? <button
                  className={`button button--link ${styles.edit}`}
                  onClick={openSideBar('settings')}
                >{pen}</button>
              : null}
          </li>
          <li>
            Batch Size: {brew.batchSize ? `${user.units === 'metric' ? parseFloat(gal2l(brew.batchSize).toFixed(2)) : brew.batchSize} ${unitLabels.vol}` : null}
            {!readOnly
              ? <button
                  className={`button button--link ${styles.edit}`}
                  onClick={openSideBar('settings')}
                >{pen}</button>
              : null}
          </li>
          <li>
            System Efficiency: {brew.systemEfficiency ? `${brew.systemEfficiency}%` : null}
            {!readOnly
              ? <button
                  className={`button button--link ${styles.edit}`}
                  onClick={openSideBar('settings')}
                >{pen}</button>
              : null}
          </li>
        </ul>
        <div className={styles.brew__stats}>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>{brew.alcoholContent ? `${brew.alcoholContent}%` : null}</span>
              <label className={styles.label}>ABV</label>
            </div>
          </div>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>{brew.attenuation ? `${brew.attenuation}%` : null}</span>
              <label className={styles.label}>ATTEN</label>
            </div>
          </div>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>{brew.ibu}</span>
              <label className={styles.label}>IBU</label>
            </div>
          </div>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                {brew.srm
                  ? <>
                      <div
                        className={styles.srmSwatch}
                        style={{backgroundColor: getSrmToRgb(brew.srm)}}
                      />
                      {brew.srm}
                    </>
                  : null }
              </span>
              <label className={styles.label}>SRM</label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BrewSettings;