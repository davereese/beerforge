import React, { useState, useEffect } from 'react';
import Info from '../../../components/Info/Info';
import { c2f, l2qt, f2c } from '../../../resources/javascript/calculator';

const StrikeTemperature = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [ratio, setRatio] = useState('');
  const [temp1, settTmp1] = useState('');
  const [temp2, setTemp2] = useState('');
  const [factor, setFactor] = useState('');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      temp1 ? units === 'metric' ? parseFloat(c2f(temp1).toFixed(4)) : temp1 : undefined,
      temp2 ? units === 'metric' ? parseFloat(c2f(temp2).toFixed(4)) : temp2 : undefined,
      ratio ? units === 'metric' ? parseFloat(l2qt(ratio).toFixed(4)) : ratio : undefined,
      factor
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = `°${props.labels.temp}`;
      return units === 'metric' ? parseFloat(f2c(result).toFixed(2)) : result;
    }
  }

  return (
    <div>
      <h2>Strike Water Temperature</h2>
      <div>
        <label htmlFor="ratio">{units === 'metric' ? 'Litres' : 'Quarts'} per {props.labels.largeWeight} of grain</label><br />
        <input
          name="ratio"
          type="number"
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
        ></input><br />
        <label htmlFor="temp1">Malt Temperature (°{props.labels.temp})</label><br />
        <input
          name="temp1"
          type="number"
          value={temp1}
          onChange={(e) => settTmp1(e.target.value)}
        ></input><br />
        <label htmlFor="temp2">Target Temperature (°{props.labels.temp})</label><br />
        <input
          name="temp2"
          type="number"
          value={temp2}
          onChange={(e) => setTemp2(e.target.value)}
        ></input><br />
        <label htmlFor="factor">Adjustment Factor <Info alignment="top-left" info="Sparging&nbsp;equipment losses." /></label><br />
        <input
          name="factor"
          type="number"
          value={factor}
          onChange={(e) => setFactor(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default StrikeTemperature;
