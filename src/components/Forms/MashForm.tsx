import React, { useState, useEffect } from 'react';

import { BrewInterface } from '../../Store/BrewContext';
import { useUser } from '../../Store/UserContext';
import { f2c, c2f, gal2l, l2gal, qt2l, l2qt } from '../../resources/javascript/calculator';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function MashForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState(props.brew);

  const dataChanged = (type: string) => (event: any) => {
    let data;
    if (type === 'targetMashTemp' || type === 'grainTemp' || type === 'spargeTemp') {
      data = user.units === 'metric' ? c2f(event.currentTarget.value) : event.currentTarget.value;
    } else if (type === 'waterToGrain') {
      data = user.units === 'metric' ? l2qt(event.currentTarget.value) : event.currentTarget.value;
    } else if (type === 'kettleSize') {
      data = user.units === 'metric' ? l2gal(props.brew.kettleSize) : event.currentTarget.value;
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
      <label>Target Temperature (°{user.units === 'metric' ? 'C' : 'F'})<br />
        <input
          type="number"
          placeholder={user.units === 'metric' ? '66' : '150'}
          defaultValue={`${user.units === 'metric' ? parseFloat(f2c(props.brew.targetMashTemp).toFixed(2)) : props.brew.targetMashTemp}`}
          onChange={dataChanged('targetMashTemp')}
        />
      </label>
      {props.brew.batchType === 'allGrain' || props.brew.batchType === 'partialMash'
        ? <label>Water to Grain Ratio ({user.units === 'metric' ? 'L' : 'qts'})<br />
            <input
              type="number"
              step="0.1"
              placeholder={props.brew.batchType === 'partialMash' ? '1' : '1.5'}
              defaultValue={`${user.units === 'metric' ? parseFloat(qt2l(props.brew.waterToGrain).toFixed(5)) : props.brew.waterToGrain}`}
              onChange={dataChanged('waterToGrain')}
            />
          </label>
        : null}
      <label>Initial Grain Temperature (°{user.units === 'metric' ? 'C' : 'F'})<br />
        <input
          type="number"
          placeholder={user.units === 'metric' ? '21' : '70'}
          defaultValue={`${user.units === 'metric' ? parseFloat(f2c(props.brew.grainTemp).toFixed(2)) : props.brew.grainTemp}`}
          onChange={dataChanged('grainTemp')}
        />
      </label>
      {props.brew.batchType === 'BIAB'
        ? <label>Kettle Size ({user.units === 'metric' ? 'L' : 'gal'})<br />
            <input
              type="number"
              placeholder={user.units === 'metric' ? '37.8' : '10'}
              defaultValue={
                props.brew.kettleSize !== undefined
                ? `${user.units === 'metric' ? parseFloat(gal2l(props.brew.kettleSize).toFixed(5)) : props.brew.kettleSize}`
                : `${user.units === 'metric' ? parseFloat(gal2l(user.kettle_size).toFixed(5)) : user.kettle_size}`
              }
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
      {props.brew.batchType !== 'BIAB'
        ? <label>Sparge Temperature (°{user.units === 'metric' ? 'C' : 'F'})<br />
            <input
              type="number"
              placeholder={user.units === 'metric' ? '75.56' : '168'}
              defaultValue={`${user.units === 'metric' ? parseFloat(f2c(props.brew.spargeTemp).toFixed(2)) : props.brew.spargeTemp}`}
              onChange={dataChanged('spargeTemp')}
            />
          </label>
        : null}
    </>
  );
};

export default MashForm;