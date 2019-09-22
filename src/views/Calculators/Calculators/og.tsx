import React, { useState } from 'react';

const OriginalGravity = (props: any) => {
  // STATE
  const [potential, setPotential] = useState('');
  const [weight, setWeight] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [volume, setVolume] = useState('');

  const { calculator } = props;

  const results = () => {
    const result = calculator([{potential: potential, weight: weight}], efficiency, volume);
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
        <label htmlFor="weight">Malt Weight (lbs)</label><br />
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
        <label htmlFor="volume">Post-boil Volume (gal)</label><br />
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
