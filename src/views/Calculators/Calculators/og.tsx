import React, { useState, useEffect } from 'react';
import { kg2lb, l2gal } from '../../../resources/javascript/calculator';

const OriginalGravity = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [potential, setPotential] = useState('');
  const [weight, setWeight] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [volume, setVolume] = useState('');

  const { calculator } = props;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      [{
        potential: potential,
        weight: weight ? units === 'metric' ? parseFloat(kg2lb(weight).toFixed(4)) : weight : undefined,
      }],
      efficiency,
      volume ? units === 'metric' ? parseFloat(l2gal(volume).toFixed(4)) : volume : undefined
    );
    return !isNaN(result) && isFinite(result) ? result : '';
  }

  return (
    <div>
      <h2>Original Gravity</h2>
      <div>
        <label htmlFor="potential">Malt Potential (ex. 34)</label><br />
        <input
          name="potential"
          type="number"
          value={potential}
          onChange={(e) => setPotential(e.target.value)}
        ></input><br />
        <label htmlFor="weight">Malt Weight ({props.labels.largeWeight})</label><br />
        <input
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input><br />
        <label htmlFor="efficiency">Mash Efficiency (%)</label><br />
        <input
          name="efficiency"
          type="number"
          value={efficiency}
          onChange={(e) => setEfficiency(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Post-boil Volume ({props.labels.vol})</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()}</p>
      </div>
    </div>
  );
}

export default OriginalGravity;
