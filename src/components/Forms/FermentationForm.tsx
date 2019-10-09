import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewContext';
import { useUser } from '../../Store/UserContext';
import { f2c, c2f } from '../../resources/javascript/calculator';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function FermentationForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState(props.brew);

  const dataChanged = (type: string) => (event: any) => {
    let data; 
    if (type === 'primaryTemp' || type === 'secondaryTemp') {
      data = user.units === 'metric' ? c2f(event.currentTarget.value) : event.currentTarget.value;
    } else {
      data = event.currentTarget.value;
    }
    setFormData({...formData, [type]: data});
  };

  const [secondary, setSecondary] = useState(props.brew.secondaryLength ? true : false);

  const toggleSecondary = (event: any) => {
    setSecondary(event.currentTarget.checked);
  };

  useEffect(() => {
    props.dataUpdated(formData, {secondary: secondary});
  });

  return(
    <>
      <div className={styles.row}>
        <label>Primary Length (days)<br />
          <input
            type="number"
            placeholder="14"
            defaultValue={`${props.brew.primaryLength}`}
            onChange={dataChanged('primaryLength')}
          />
        </label>
        <label>Primary Temp (°{user.units === 'metric' ? 'C' : 'F'})<br />
          <input
            type="number"
            placeholder={user.units === 'metric' ? '17' : '64'}
            defaultValue={`${user.units === 'metric' ? parseFloat(f2c(props.brew.primaryTemp).toFixed(2)) : props.brew.primaryTemp}`}
            onChange={dataChanged('primaryTemp')}
          />
        </label>
      </div>
      <input
        type="checkbox"
        id="fermentSecCheck"
        onChange={toggleSecondary}
        defaultChecked={secondary}
      />
      <label htmlFor="fermentSecCheck">Secondary Fermentation</label>
      {secondary === true
        ? <div className={styles.row}>
          <label>Secondary Length (days)<br />
            <input
              type="number"
              placeholder="14"
              defaultValue={`${props.brew.secondaryLength}`}
              onChange={dataChanged('secondaryLength')}
            />
          </label>
          <label>Secondary Temp (°{user.units === 'metric' ? 'C' : 'F'})<br />
            <input
              type="number"
              placeholder={user.units === 'metric' ? '17' : '64'}
              defaultValue={`${user.units === 'metric' ? parseFloat(f2c(props.brew.secondaryTemp).toFixed(2)) : props.brew.secondaryTemp}`}
              onChange={dataChanged('secondaryTemp')}
            />
          </label>
        </div>
        : null
      }
    </>
  );
};

export default FermentationForm;