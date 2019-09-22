import React, { useState } from 'react';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';

const SRM = (props:any) => {
  // STATE
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator([{lovibond: color, weight: weight}], volume);
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
        <label htmlFor="color">Malt Color</label><br />
        <input
          name="color"
          type="number"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        ></input><br />
        <label htmlFor="weight">Malt Weight (lbs)</label><br />
        <input
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Final Volume (gal)</label><br />
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
