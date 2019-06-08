import React, { useState, useEffect } from 'react';

import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function BoilForm(props: Props) {
  const [formData, setFormData] = useState(props.brew);

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
          defaultValue={`${props.brew.boilLength}`}
          onChange={dataChanged('boilLength')}
        />
      </label>
      <label>Evaporation Rate (%/hr)<br />
        <input
          type="number"
          placeholder="1.5"
          defaultValue={`${props.brew.evaporationRate}`}
          onChange={dataChanged('evaporationRate')}
        />
      </label>
    </>
  );
};

export default BoilForm;