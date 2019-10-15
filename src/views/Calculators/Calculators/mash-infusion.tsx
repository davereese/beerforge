import React, { useState } from 'react';

const MashInfusion = (props: any) => {
  // STATE
  const [targetTemp, setTargetTemp] = useState('');
  const [initailTemp, setInitailTemp] = useState('');
  const [grainVol, setGrainVol] = useState('');
  const [totalMashVol, setTotalMashVol] = useState('');
  const [infusionWaterTemp, setInfusionWaterTemp] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(targetTemp, initailTemp, grainVol, totalMashVol, infusionWaterTemp);
      if (!isNaN(result) && isFinite(result)) {
        label = 'qts';
        return result;
      }
  }

  return (
    <div>
      <h2>Mash Infusion Water Volume (qts)</h2>
      <div>
        <label htmlFor="targetTemp">Target Mash Temperature (°F)</label><br />
        <input
          name="targetTemp"
          type="number"
          value={targetTemp}
          onChange={(e) => setTargetTemp(e.target.value)}
        ></input><br />
        <label htmlFor="initailTemp">Current Mash Temperature (°F)</label><br />
        <input
          name="initailTemp"
          type="number"
          value={initailTemp}
          onChange={(e) => setInitailTemp(e.target.value)}
        ></input><br />
        <label htmlFor="grainVol">Malt Weight (lbs)</label><br />
        <input
          name="grainVol"
          type="number"
          value={grainVol}
          onChange={(e) => setGrainVol(e.target.value)}
        ></input><br />
        <label htmlFor="totalMashVol">Current Mash Water Volume (qts)</label><br />
        <input
          name="totalMashVol"
          type="number"
          value={totalMashVol}
          onChange={(e) => setTotalMashVol(e.target.value)}
        ></input><br />
        <label htmlFor="infusionWaterTemp">Infusion Water Temperature</label><br />
        <input
          name="infusionWaterTemp"
          type="number"
          value={infusionWaterTemp}
          onChange={(e) => setInfusionWaterTemp(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default MashInfusion;
