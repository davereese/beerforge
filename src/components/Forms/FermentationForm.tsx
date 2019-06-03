import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function FermentationForm(props: Props) {
  const [formData, setFormData] = useState(props.data);

  const dataChanged = (type: string) => (event: any) => {
    const data = event.currentTarget.value;
    setFormData({...formData, [type]: data});
  };

  const [secondary, setSecondary] = useState(props.data.secondaryLength ? true : false);

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
            defaultValue={`${props.data.primaryLength}`}
            onChange={dataChanged('primaryLength')}
          />
        </label>
        <label>Primary Temp (°F)<br />
          <input
            type="number"
            placeholder="64"
            defaultValue={`${props.data.primaryTemp}`}
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
              defaultValue={`${props.data.secondaryLength}`}
              onChange={dataChanged('secondaryLength')}
            />
          </label>
          <label>Secondary Temp (°F)<br />
            <input
              type="number"
              placeholder="64"
              defaultValue={`${props.data.secondaryTemp}`}
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