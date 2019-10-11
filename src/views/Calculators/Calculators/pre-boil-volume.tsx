import React, { useState } from 'react';
import { useUser } from '../../../Store/UserContext';

const PreBoilVolume = (props: any) => {
  // CONTEXT
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  // STATE
  const [batchType, setBatchType] = useState('allGrain');
  const [totalWaterVol, setTotalWaterVol] = useState('');
  const [grainWeight, setGrainWeight] = useState('');

  const { calculator } = props;
  const equipmentLoss = user.equipment_loss ? user.equipment_loss : 1;
  const absorptionRate = user.absorption_rate ? user.absorption_rate : 0.125;
  let vol = null;

  const results = () => {
    const result = calculator(totalWaterVol, grainWeight, equipmentLoss, absorptionRate, batchType);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        vol = 'gal';
        return result;
      }
  }

  return (
    <div>
      <h2>Pre-Boil Volume</h2>
      <div>
        <label htmlFor="batchType">Batch Type</label><br />
        <select
          name="batchType"
          value={batchType}
          onChange={(e) => setBatchType(e.target.value)}
        >
          <option value="allGrain">All Grain</option>
          <option value="BIAB">BIAB</option>
        </select><br />
        <label htmlFor="totalWaterVol">Total Water Volume</label><br />
        <input
          name="totalWaterVol"
          type="number"
          value={totalWaterVol}
          onChange={(e) => setTotalWaterVol(e.target.value)}
        ></input><br />
        <label htmlFor="grainWeight">Malt Weight (lbs)</label><br />
        <input
          name="grainWeight"
          type="number"
          value={grainWeight}
          onChange={(e) => setGrainWeight(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{vol}</label></p>
      </div>
    </div>
  );
}

export default PreBoilVolume;
