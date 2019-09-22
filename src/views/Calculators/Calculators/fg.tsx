import React, { useState } from 'react';

const FinalGravity = (props: any) => {
  // STATE
  const [og, setOg] = useState('');
  const [attenuation, setAttenuation] = useState('');

  const { calculator } = props;

  const results = () => {
    const result = calculator(og, attenuation);
      return !isNaN(result) && isFinite(result) && result > 0 ? result : '';
  }

  return (
    <div>
      <h2>Final Gravity</h2>
      <div>
        <label htmlFor="og">Original Gravity</label><br />
        <input
          name="og"
          type="number"
          value={og}
          onChange={(e) => setOg(e.target.value)}
        ></input><br />
        <label htmlFor="attenuation">Attenuation (%)</label><br />
        <input
          name="attenuation"
          type="number"
          value={attenuation}
          onChange={(e) => setAttenuation(e.target.value)}
        ></input>
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()}</p>
      </div>
    </div>
  );
}

export default FinalGravity;
