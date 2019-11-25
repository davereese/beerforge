import React, { useState, useEffect } from 'react';
import { c2f, l2qt, qt2l, kg2lb } from '../../../resources/javascript/calculator';

const MashInfusion = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [targetTemp, setTargetTemp] = useState('');
  const [initailTemp, setInitailTemp] = useState('');
  const [grainVol, setGrainVol] = useState('');
  const [totalMashVol, setTotalMashVol] = useState('');
  const [infusionWaterTemp, setInfusionWaterTemp] = useState('');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      targetTemp ? units === 'metric' ? parseFloat(c2f(targetTemp).toFixed(4)) : targetTemp : undefined,
      initailTemp ? units === 'metric' ? parseFloat(c2f(initailTemp).toFixed(4)) : initailTemp : undefined,
      grainVol ? units === 'metric' ? parseFloat(kg2lb(grainVol).toFixed(4)) : grainVol : undefined,
      totalMashVol ? units === 'metric' ? parseFloat(l2qt(totalMashVol).toFixed(4)) : totalMashVol : undefined,
      infusionWaterTemp ? units === 'metric' ? parseFloat(c2f(infusionWaterTemp).toFixed(4)) : infusionWaterTemp : undefined,
    );
    if (!isNaN(result) && isFinite(result)) {
      label = props.labels.smallVol;
      return units === 'metric' ? parseFloat(qt2l(result).toFixed(2)) : result;
    }
  }

  return (
    <div>
      <h2>Mash Infusion Water Volume ({props.labels.smallVol})</h2>
      <div>
        <label htmlFor="targetTemp">Target Mash Temperature (°{props.labels.temp})</label><br />
        <input
          name="targetTemp"
          type="number"
          value={targetTemp}
          onChange={(e) => setTargetTemp(e.target.value)}
        ></input><br />
        <label htmlFor="initailTemp">Current Mash Temperature (°{props.labels.temp})</label><br />
        <input
          name="initailTemp"
          type="number"
          value={initailTemp}
          onChange={(e) => setInitailTemp(e.target.value)}
        ></input><br />
        <label htmlFor="grainVol">Malt Weight ({props.labels.largeWeight})</label><br />
        <input
          name="grainVol"
          type="number"
          value={grainVol}
          onChange={(e) => setGrainVol(e.target.value)}
        ></input><br />
        <label htmlFor="totalMashVol">Current Mash Water Volume ({props.labels.smallVol})</label><br />
        <input
          name="totalMashVol"
          type="number"
          value={totalMashVol}
          onChange={(e) => setTotalMashVol(e.target.value)}
        ></input><br />
        <label htmlFor="infusionWaterTemp">Infusion Water Temperature (°{props.labels.temp})</label><br />
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
