import React, { useState, useEffect } from 'react';

import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function MashForm(props: Props) {
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
      <label>Target Temperature (°F)<br />
        <input
          type="number"
          placeholder="150"
          defaultValue={`${props.data.targetMashTemp}`}
          onChange={dataChanged('targetMashTemp')}
        />
      </label>
      <label>Water to Grain Ratio (qts)<br />
        <input
          type="number"
          step="0.1"
          placeholder="1.5"
          defaultValue={`${props.data.waterToGrain}`}
          onChange={dataChanged('waterToGrain')}
        />
      </label>
      <label>Initial Grain Temperature (°F)<br />
        <input
          type="number"
          placeholder="70"
          defaultValue={`${props.data.grainTemp}`}
          onChange={dataChanged('grainTemp')}
        />
      </label>
      <label>Mash Length (min)<br />
        <input
          type="number"
          placeholder="60"
          defaultValue={`${props.data.mashLength}`}
          onChange={dataChanged('mashLength')}
        />
      </label>
      <label>Sparge Temperature (°F)<br />
        <input
          type="number"
          placeholder="168"
          defaultValue={`${props.data.spargeTemp}`}
          onChange={dataChanged('spargeTemp')}
        />
      </label>
    </>
  );
};

export default MashForm;