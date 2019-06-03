import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function BoilForm(props: Props) {
  const [formData, setFormData] = useState(props.data);

  const dataChanged = (type: string) => (event: any) => {
    const data = event.currentTarget.value;
    setFormData({...formData, [type]: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <label>Boil Length (min)<br />
        <input
          type="number"
          placeholder="60"
          defaultValue={`${props.data.boilLength}`}
          onChange={dataChanged('boilLength')}
        />
      </label>
      <label>Evaporation Rate (%/hr)<br />
        <input
          type="number"
          placeholder="1.5"
          defaultValue={`${props.data.evaporationRate}`}
          onChange={dataChanged('evaporationRate')}
        />
      </label>
    </>
  );
};

export default BoilForm;