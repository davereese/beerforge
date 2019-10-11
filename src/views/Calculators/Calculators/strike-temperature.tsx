import React, { useState } from 'react';
import Info from '../../../components/Info/Info';

const StrikeTemperature = (props: any) => {
  // STATE
  const [ratio, setRatio] = useState('');
  const [temp1, settTmp1] = useState('');
  const [temp2, setTemp2] = useState('');
  const [factor, setFactor] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(temp1, temp2, ratio, factor);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = '°F';
      return result;
    }
  }

  return (
    <div>
      <h2>Strike Water Temperature</h2>
      <div>
        <label htmlFor="ratio">Quarts per lb of grain</label><br />
        <input
          name="ratio"
          type="number"
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
        ></input><br />
        <label htmlFor="temp1">Malt Temperature (°F)</label><br />
        <input
          name="temp1"
          type="number"
          value={temp1}
          onChange={(e) => settTmp1(e.target.value)}
        ></input><br />
        <label htmlFor="temp2">Target Temperature (°F)</label><br />
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
