import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../store/BrewContext';
import { useUser } from '../../store/UserContext';
import { f2c, c2f } from '../../resources/javascript/calculator';
import Select from '../Select/Select';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function PackagingForm(props: Props) {
  const [user] = useUser();
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
        <Select
          options={[
            {value:"", option:"Choose One"},
            {value:"bottled", option:"Bottled"},
            {value:"kegged", option:"Kegged"},
          ]}
          value={formData.packagingType || ""}
          onChange={dataChanged('packagingType')}
          className="capitalize lightInput"
        />
      </label>
      <label>Carbonation Method<br />
        <Select
          options={[
            {value:"", option:"Choose One"},
            {option: 'Forced CO2', value: 'forced'},
            {value:"caneSugar", option:"Cane Sugar"},
            {value:"cornSugar", option:"Corn Sugar"},
            {value:"dme", option:"DME"},
          ]}
          value={formData.carbonationMethod || ""}
          onChange={dataChanged('carbonationMethod')}
          className="capitalize lightInput"
        />
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