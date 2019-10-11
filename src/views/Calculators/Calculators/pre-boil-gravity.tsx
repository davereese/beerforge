import React, { useState } from 'react';
import { useUser } from '../../../Store/UserContext';

const PreBoilGravity = (props: any) => {
  // CONTEXT
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  // STATE
  const [batchType, setBatchType] = useState('allGrain');
  const [og, setOg] = useState('');
  const [volume, setVolume] = useState('');
  const [grainVol, setGrainVol] = useState('');
  const [totalWaterVol, setTotalWaterVol] = useState('');

  const { calculator } = props;
  const equipmentLoss = user.equipment_loss ? user.equipment_loss : 1;
  const absorptionRate = user.absorption_rate ? user.absorption_rate : 0.125;

  const results = () => {
    const result = calculator(og, grainVol, totalWaterVol, volume, equipmentLoss, absorptionRate, batchType);
      return !isNaN(result) && isFinite(result) && result > 1 ? result : '';
  }

  return (
    <div>
      <h2>Pre-Boil Gravity</h2>
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
        <label htmlFor="grainVol">Malt Weight (lbs)</label><br />
        <input
          name="grainVol"
          type="number"
          value={grainVol}
          onChange={(e) => setGrainVol(e.target.value)}
        ></input><br />
        <label htmlFor="totalWaterVol">Total Water Volume</label><br />
        <input
          name="totalWaterVol"
          type="number"
          value={totalWaterVol}
          onChange={(e) => setTotalWaterVol(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Post-boil Volume (gal)</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
        <label htmlFor="og">Original Gravity</label><br />
        <input
          name="og"
          type="number"
          value={og}
          onChange={(e) => setOg(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()}</p>
      </div>
    </div>
  );
}

export default PreBoilGravity;
