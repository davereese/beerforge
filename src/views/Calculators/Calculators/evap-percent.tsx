import React, { useState } from 'react';

const EvaporationPercent = (props: any) => {
  // STATE
  const [postBoilV, setPostBoilV] = useState('');
  const [preBoilV, setPreBoilV] = useState('');
  const [boilTime, setBoilTime] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(preBoilV, postBoilV, boilTime);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = '%';
      return result;
    }
  }

  return (
    <div>
      <h2>Evaporation %/hr</h2>
      <div>
        <label htmlFor="preBoilV">Pre-Boil volume</label><br />
        <input
          name="preBoilV"
          type="number"
          value={preBoilV}
          onChange={(e) => setPreBoilV(e.target.value)}
        ></input><br />
        <label htmlFor="postBoilV">Post-Boil volume</label><br />
        <input
          name="postBoilV"
          type="number"
          value={postBoilV}
          onChange={(e) => setPostBoilV(e.target.value)}
        ></input><br />
        <label htmlFor="boilTime">Boil Time (min)</label><br />
        <input
          name="boilTime"
          type="number"
          value={boilTime}
          onChange={(e) => setBoilTime(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()}<label>{label}</label></p>
      </div>
    </div>
  );
}

export default EvaporationPercent;
