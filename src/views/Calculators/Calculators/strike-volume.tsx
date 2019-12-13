import React, { useState, useEffect } from 'react';
import { l2qt, gal2l } from '../../../resources/javascript/calculator';

const StrikeVolume = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [ratio, setRatio] = useState('');
  const [weight, setWeight] = useState('');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      weight,
      ratio ? units === 'metric' ? parseFloat(l2qt(ratio).toFixed(4)) : ratio : undefined,
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = props.labels.vol;
      return units === 'metric' ? parseFloat(gal2l(result).toFixed(1)) : result;
    }
  }

  return (
    <div>
      <h2>Strike Water Volume</h2>
      <div>
        <label htmlFor="weight">Malt Weight ({props.labels.largeWeight})</label><br />
        <input
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input><br />
        <label htmlFor="ratio">{units === 'metric' ? 'Litres' : 'Quarts'} per {props.labels.largeWeight} of grain</label><br />
        <input
          name="ratio"
          type="number"
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
        ></input>
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default StrikeVolume;
