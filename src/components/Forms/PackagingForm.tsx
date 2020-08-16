import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../store/BrewContext';
import { useUser } from '../../store/UserContext';
import { f2c, c2f } from '../../resources/javascript/calculator';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function PackagingForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState(props.brew);

  const dataChanged = (type: string) => (event: any) => {
    let data;
    if (type === 'beerTemp') {
      data = user.units === 'metric' ? c2f(event.currentTarget.value) : event.currentTarget.value;
    } else {
      data = event.currentTarget.value;
    }
    setFormData({...formData, [type]: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <label>Packaging Type<br />
        <select
          defaultValue={`${props.brew.packagingType}`}
          onChange={dataChanged('packagingType')}
        >
          <option value="">Choose One</option>
          <option value="bottled">Bottled</option>
          <option value="kegged">Kegged</option>
        </select>
      </label>
      <label>Carbonation Method<br />
        <select
          defaultValue={`${props.brew.carbonationMethod}`}
          onChange={dataChanged('carbonationMethod')}
        >
          <option value="">Choose One</option>
          {formData.packagingType !== 'bottled' ? <option value="forced">Forced CO2</option> : null}
          <option value="caneSugar">Cane Sugar</option>
          <option value="cornSugar">Corn Sugar</option>
          <option value="dme">DME</option>
        </select>
      </label>
      <div className={styles.row}>
        <label>CO<sub>2</sub> Volume Target<br />
          <input
            type="number"
            step="0.1"
            placeholder="2.5"
            defaultValue={`${props.brew.CO2VolumeTarget}`}
            onChange={dataChanged('CO2VolumeTarget')}
           />
        </label>
        <label>Beer Temp (°F)<br />
          <input
            type="number"
            placeholder={user.units === 'metric' ? '1.1' : '34'}
            defaultValue={`${user.units === 'metric' ? parseFloat(f2c(props.brew.beerTemp).toFixed(1)) : props.brew.beerTemp}`}
            onChange={dataChanged('beerTemp')}
          />
        </label>
      </div>
    </>
  );
};

export default PackagingForm;