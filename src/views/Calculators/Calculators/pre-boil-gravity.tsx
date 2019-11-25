import React, { useState, useEffect } from 'react';
import { useUser } from '../../../Store/UserContext';
import { l2gal, kg2lb } from '../../../resources/javascript/calculator';

const PreBoilGravity = (props: any) => {
  // CONTEXT
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  // STATE
  const [units, setUnits] = useState(props.units);
  const [batchType, setBatchType] = useState('allGrain');
  const [og, setOg] = useState('');
  const [volume, setVolume] = useState('');
  const [grainVol, setGrainVol] = useState('');
  const [totalWaterVol, setTotalWaterVol] = useState('');

  const { calculator } = props;
  const equipmentLoss = user.equipment_loss ? user.equipment_loss : 1;
  const absorptionRate = user.absorption_rate ? user.absorption_rate : 0.125;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      og,
      grainVol ? units === 'metric' ? parseFloat(kg2lb(grainVol).toFixed(4)) : grainVol : undefined,
      totalWaterVol ? units === 'metric' ? parseFloat(l2gal(totalWaterVol).toFixed(4)) : totalWaterVol : undefined,
      volume ? units === 'metric' ? parseFloat(l2gal(volume).toFixed(4)) : volume : undefined,
      equipmentLoss,
      absorptionRate,
      batchType
    );
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
        <label htmlFor="grainVol">Malt Weight ({props.labels.largeWeight})</label><br />
        <input
          name="grainVol"
          type="number"
          value={grainVol}
          onChange={(e) => setGrainVol(e.target.value)}
        ></input><br />
        <label htmlFor="totalWaterVol">Total Water Volume ({props.labels.vol})</label><br />
        <input
          name="totalWaterVol"
          type="number"
          value={totalWaterVol}
          onChange={(e) => setTotalWaterVol(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Post-boil Volume ({props.labels.vol})</label><br />
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
