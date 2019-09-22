import React, { useState } from 'react';

const PreBoilVolume = (props: any) => {
  // STATE
  const [totalWaterVol, setTotalWaterVol] = useState('');
  const [grainWeight, setGrainWeight] = useState('');

  const { calculator } = props;
  let vol = null;

  const results = () => {
    const result = calculator(totalWaterVol, grainWeight);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        vol = 'gal';
        return result;
      }
  }

  return (
    <div>
      <h2>Pre-Boil Volume</h2>
      <div>
        <label htmlFor="totalWaterVol">Total Water Volume</label><br />
        <input
          name="totalWaterVol"
          type="number"
          value={totalWaterVol}
          onChange={(e) => setTotalWaterVol(e.target.value)}
        ></input><br />
        <label htmlFor="grainWeight">Malt Weight (lbs)</label><br />
        <input
          name="grainWeight"
          type="number"
          value={grainWeight}
          onChange={(e) => setGrainWeight(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{vol}</label></p>
      </div>
    </div>
  );
}

export default PreBoilVolume;
