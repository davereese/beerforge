import React from 'react';

import styles from '../Brew.module.scss';
import { parseStringValues } from '../BrewUtils';
import { BrewInterface } from '../../../store/BrewContext';
import { f2c, oz2g } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
}

const BrewPackaging = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user} = props;
  return (
    <div className={styles.brew__section}>
      <div className={styles.brew__header}>
        <h2>Packaging</h2>
        {!readOnly
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('packaging')}
            ><span>Edit</span></button>
          : null}
      </div>
      <div className={styles.section__values}>
        <span>{brew.packagingType && brew.carbonationMethod
          ? <strong>{parseStringValues(brew.packagingType)}/{parseStringValues(brew.carbonationMethod)}</strong>
          : null}
        </span>
        <span>{brew.CO2VolumeTarget
          ? <>CO<sub>2</sub> Vol: <strong>{brew.CO2VolumeTarget}</strong></>
          : null}</span>
        <span>{brew.beerTemp
          ? <>Temp: <strong>{user.units === 'metric' ? parseFloat(f2c(brew.beerTemp).toFixed(1)) : brew.beerTemp} °{unitLabels.temp}</strong></>
          : null}</span>
        <span>{brew.amountForCO2
          ? <>{brew.carbonationMethod === 'forced' ? 'Pressure: ' : 'Amount: '}
          <strong>
            {brew.carbonationMethod === 'forced'
              ? `${brew.amountForCO2} psi`
              : user.units === 'metric' ? parseFloat(oz2g(brew.amountForCO2).toFixed(2)) + unitLabels.smallWeight : `${brew.amountForCO2} ${unitLabels.smallWeight}`}
          </strong></>
          : null}
        </span>
      </div>
    </div>
  );
}

export default BrewPackaging;