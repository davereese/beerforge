import React, { useState } from 'react';

const CO2 = (props: any) => {
  // STATE
  const [temp, setTemp] = useState('');
  const [beerVol, setBeerVol] = useState('');
  const [co2Vol, setCo2Vol] = useState('');
  const [method, setMethod] = useState('cornSugar');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(temp, co2Vol, method, beerVol);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = method === 'forced' ? 'psi' : 'oz';
      return result;
    } else {
      return '';
    }
  }

  return (
    <div>
      <h2>Carbonation</h2>
      <div>
        <label htmlFor="method">Carbonation Method</label><br />
        <select
          name="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="cornSugar">Corn Sugar</option>
          <option value="caneSugar">Cane Sugar</option>
          <option value="dme">DME</option>
          <option value="forced">Forced/Kegged</option>
        </select><br />
        <label htmlFor="beerVol">Beer Volume</label><br />
        <input
          name="beerVol"
          type="number"
          value={beerVol}
          onChange={(e) => setBeerVol(e.target.value)}
        ></input><br />
        <label htmlFor="co2Vol">CO2 Target Volume</label><br />
        <input
          name="co2Vol"
          type="number"
          value={co2Vol}
          onChange={(e) => setCo2Vol(e.target.value)}
        ></input><br />
        <label htmlFor="temp">Temperature</label><br />
        <input
          name="temp"
          type="number"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default CO2;
