import React, { useState, useEffect } from 'react';

import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';
import { kg2lb, l2gal } from '../../../resources/javascript/calculator';

const SRM = (props:any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      [{
        lovibond: color,
        weight: weight ? units === 'metric' ? parseFloat(kg2lb(weight).toFixed(4)) : weight : undefined,
      }],
      volume ? units === 'metric' ? parseFloat(l2gal(volume).toFixed(4)) : volume : undefined
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'SRM';
      const style = {
        display: 'inline-block',
        marginRight: '4px',
        marginTop: '4px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        border: '1px solid #ffdb4a',
        backgroundColor: getSrmToRgb(result)
      };
      return <>
        <span style={style} />
        {result}
      </>;
    } else {
        return '';
    }
  }

  return (
    <div>
      <h2>Beer Color</h2>
      <div>
        <label htmlFor="color">Malt Color (°L)</label><br />
        <input
          name="color"
          type="number"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        ></input><br />
        <label htmlFor="weight">Malt Weight ({props.labels.largeWeight})</label><br />
        <input
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Final Volume ({props.labels.vol})</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default SRM;
