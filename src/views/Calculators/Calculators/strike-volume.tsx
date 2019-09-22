import React, { useState } from 'react';

const StrikeVolume = (props: any) => {
  // STATE
  const [ratio, setRatio] = useState('');
  const [weight, setWeight] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(weight, ratio);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'gal';
      return result;
    }
  }

  return (
    <div>
      <h2>Strike Water Volume</h2>
      <div>
        <label htmlFor="weight">Malt Weight (lbs)</label><br />
        <input
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input><br />
        <label htmlFor="ratio">Quarts per lb of grain</label><br />
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
