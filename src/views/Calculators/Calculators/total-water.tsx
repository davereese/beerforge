import React, { useState } from 'react';

const TotalWater = (props: any) => {
  // STATE
  const [batchSize, setBatchSize] = useState('');
  const [grainWeight, setGrainWeight] = useState('');
  const [boilTime, setBoilTime] = useState('');
  const [boilOff, setBoilOff] = useState('');

  const { calculator } = props;
  let label = null;

  const results = () => {
    const result = calculator(parseInt(batchSize), parseInt(boilTime), parseInt(boilOff), parseInt(grainWeight));

      if (batchSize && boilTime && boilOff && grainWeight && !isNaN(result) && isFinite(result)) {
        label = 'gal';
        return result;
      }
  }

  return (
    <div>
      <h2>Total Water Needed</h2>
      <div>
        <label htmlFor="batchSize">Batch Size</label><br />
        <input
          name="batchSize"
          type="number"
          value={batchSize}
          onChange={(e) => setBatchSize(e.target.value)}
        ></input><br />
        <label htmlFor="grainWeight">Malt Weight (lbs)</label><br />
        <input
          name="grainWeight"
          type="number"
          value={grainWeight}
          onChange={(e) => setGrainWeight(e.target.value)}
        ></input><br />
        <label htmlFor="boilTime">Boil Time (min)</label><br />
        <input
          name="boilTime"
          type="number"
          value={boilTime}
          onChange={(e) => setBoilTime(e.target.value)}
        ></input><br />
        <label htmlFor="boilOff">Evaporation Rate %/hr</label><br />
        <input
          name="boilOff"
          type="number"
          value={boilOff}
          onChange={(e) => setBoilOff(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default TotalWater;
