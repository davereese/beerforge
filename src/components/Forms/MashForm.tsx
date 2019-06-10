import React, { useState, useEffect } from 'react';

import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function MashForm(props: Props) {
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
      <label>Target Temperature (°F)<br />
        <input
          type="number"
          placeholder="150"
          defaultValue={`${props.brew.targetMashTemp}`}
          onChange={dataChanged('targetMashTemp')}
        />
      </label>
      {props.brew.batchType === 'allGrain' || props.brew.batchType === 'partialMash'
        ? <label>Water to Grain Ratio (qts)<br />
            <input
              type="number"
              step="0.1"
              placeholder={props.brew.batchType === 'partialMash' ? '1' : '1.5'}
              defaultValue={`${props.brew.waterToGrain}`}
              onChange={dataChanged('waterToGrain')}
            />
          </label>
        : null}
      <label>Initial Grain Temperature (°F)<br />
        <input
          type="number"
          placeholder="70"
          defaultValue={`${props.brew.grainTemp}`}
          onChange={dataChanged('grainTemp')}
        />
      </label>
      {props.brew.batchType === 'BIAB'
        ? <label>Kettle Size (gal)<br />
            <input
              type="number"
              placeholder="10"
              defaultValue={`${props.brew.kettleSize}`}
              onChange={dataChanged('kettleSize')}
            />
          </label>
        : null}
      <label>Mash Length (min)<br />
        <input
          type="number"
          placeholder="60"
          defaultValue={`${props.brew.mashLength}`}
          onChange={dataChanged('mashLength')}
        />
      </label>
      <label>Sparge Temperature (°F)<br />
        <input
          type="number"
          placeholder="168"
          defaultValue={`${props.brew.spargeTemp}`}
          onChange={dataChanged('spargeTemp')}
        />
      </label>
    </>
  );
};

export default MashForm;