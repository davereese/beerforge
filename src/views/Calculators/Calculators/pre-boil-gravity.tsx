import React, { useState } from 'react';

const PreBoilGravity = (props: any) => {
  // STATE
  const [og, setOg] = useState('');
  const [volume, setVolume] = useState('');
  const [grainVol, setGrainVol] = useState('');
  const [totalWaterVol, setTotalWaterVol] = useState('');

  const { calculator } = props;

  const results = () => {
    const result = calculator(og, grainVol, totalWaterVol, volume);
      return !isNaN(result) && isFinite(result) && result > 1 ? result : '';
  }

  return (
    <div>
      <h2>Pre-Boil Gravity</h2>
      <div>
      <label htmlFor="grainVol">Malt Weight (lbs)</label><br />
        <input
          name="grainVol"
          type="number"
          value={grainVol}
          onChange={(e) => setGrainVol(e.target.value)}
        ></input><br />
        <label htmlFor="totalWaterVol">Total Water Volume</label><br />
        <input
          name="totalWaterVol"
          type="number"
          value={totalWaterVol}
          onChange={(e) => setTotalWaterVol(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Post-boil Volume (gal)</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
        <label htmlFor="og">Original Gravity</label><br />
        <input
          name="og"
          type="number"
          value={og}
          onChange={(e) => setOg(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()}</p>
      </div>
    </div>
  );
}

export default PreBoilGravity;
