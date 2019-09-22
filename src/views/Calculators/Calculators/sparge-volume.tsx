import React, { useState } from 'react';

const SpargeVolume = (props: any) => {
   // STATE
   const [totalVol, settotalVol] = useState('');
   const [mashVol, setMashVol] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(totalVol, mashVol);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'gal';
      return result;
    }
  }

  return (
    <div>
      <h2>Sparge Water Volume</h2>
      <div>
        <label htmlFor="totalVol">Total water volume</label><br />
        <input
          name="totalVol"
          type="number"
          value={totalVol}
          onChange={(e) => settotalVol(e.target.value)}
        ></input><br />
        <label htmlFor="mashVol">Mash water volume</label><br />
        <input
          name="mashVol"
          type="number"
          value={mashVol}
          onChange={(e) => setMashVol(e.target.value)}
        ></input>
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default SpargeVolume;
