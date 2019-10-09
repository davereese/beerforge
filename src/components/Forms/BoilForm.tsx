import React, { useState, useEffect } from 'react';

import { BrewInterface } from '../../Store/BrewContext';
import { useUser } from '../../Store/UserContext';
import { gal2l, l2gal } from '../../resources/javascript/calculator';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function BoilForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState(props.brew);

  const dataChanged = (type: string) => (event: any) => {
    let data;
    if (type === 'evaporationRate' && props.brew.batchType === 'BIAB') {
      data = user.units === 'metric' ? l2gal(props.brew.kettleSize) : event.currentTarget.value;
    } else {
      data = event.currentTarget.value
    }
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
      <label>{props.brew.batchType === 'BIAB' ? 'Evaporation Loss (gal)' : 'Evaporation Rate (%/hr)'}<br />
        <input
          type="number"
          placeholder={props.brew.batchType === 'BIAB' ? '0.5' : '1.5'}
          defaultValue={`${props.brew.batchType === 'BIAB'
            ? user.units === 'metric' ? parseFloat(gal2l(props.brew.evaporationRate).toFixed(5)) : props.brew.evaporationRate
            : props.brew.evaporationRate}`}
          onChange={dataChanged('evaporationRate')}
        />
      </label>
    </>
  );
};

export default BoilForm;