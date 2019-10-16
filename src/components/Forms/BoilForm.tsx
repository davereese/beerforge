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

  useEffect(() => {
    if (props.brew.batchType !== 'BIAB' && !formData.evaporationRate) {
      setFormData({...formData, evaporationRate: user.evap_rate ? user.evap_rate : ''});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          value={`${props.brew.batchType === 'BIAB' && formData.evaporationRate
            ? user.units === 'metric' ? parseFloat(gal2l(formData.evaporationRate).toFixed(5)) : formData.evaporationRate.toString()
            : formData.evaporationRate ? formData.evaporationRate.toString() : ''}`}
          onChange={dataChanged('evaporationRate')}
        />
      </label>
    </>
  );
};

export default BoilForm;