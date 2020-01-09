import React from 'react';

import styles from '../Brew.module.scss';
import Card from '../../../components/Card/Card';
import { BrewInterface } from '../../../Store/BrewContext';
import { parseStringValues } from '../BrewUtils';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';
import { gal2l } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  clone: any;
  user: any;
}

const BrewSettingsAndStats = (props: Props) => {
  const {brew, newBrew, readOnly, unitLabels, openSideBar, clone, user} = props;
  return (
    <Card color="brew" customClass={newBrew ? styles.new : styles.view}>
      <div className={styles.brew__numbers}>
        <div className={styles.brew__numbersMenu}>
          <ul className={styles.brew__numbersList}>
            <li>
              Brew Method: <strong>{parseStringValues(brew.batchType)}</strong>
            </li>
            <li>
              Batch Size: <strong>{brew.batchSize
                ? `${user.units === 'metric'
                  ? parseFloat(gal2l(brew.batchSize).toFixed(2))
                  : brew.batchSize} ${unitLabels.vol}`
                : null}</strong>
            </li>
            <li>
              Mash Efficiency: <strong>{brew.mashEfficiency ? `${brew.mashEfficiency}%` : null}</strong>
            </li>
          </ul>
       
          <div className={styles.brew__menu}>
            {!readOnly && <button
                className={`button button--icon-large button--light-brown button--no-shadow gear`}
                onClick={openSideBar('settings')}
                title="Settings"
              ><span>Settings</span></button>}
              {!readOnly && <button
                className={`button button--icon-large button--light-brown button--no-shadow eq`}
                onClick={() =>{}}
                title="Brew EQ"
              ><span>Brew&nbsp;EQ</span></button>}
              <button
                className={`button button--icon-large button--light-brown button--no-shadow clone`}
                onClick={clone()}
                title="Clone"
                disabled={newBrew}
              ><span>Clone</span></button>
              {!readOnly && <button
                className={`button button--icon-large button--light-brown button--no-shadow results`}
                onClick={() =>{}}
                disabled={newBrew}
                title="Brewday Results"
              ><span>Brewday&nbsp;Results</span></button>}
            </div>
        </div>
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

export default BrewSettingsAndStats;