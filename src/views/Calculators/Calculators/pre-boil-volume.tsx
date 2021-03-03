import React, { useState, useEffect } from 'react';
import { useUser } from '../../../store/UserContext';
import { l2gal, kg2lb, gal2l } from '../../../resources/javascript/calculator';
import Select from '../../../components/Select/Select';

const PreBoilVolume = (props: any) => {
  // CONTEXT
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  // STATE
  const [units, setUnits] = useState(props.units);
  const [batchType, setBatchType] = useState('allGrain');
  const [totalWaterVol, setTotalWaterVol] = useState('');
  const [grainWeight, setGrainWeight] = useState('');

  const { calculator } = props;
  const equipmentLoss = user.equipment_loss ? user.equipment_loss : 1;
  const absorptionRate = user.absorption_rate ? user.absorption_rate : 0.125;
  let vol = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      totalWaterVol ? units === 'metric' ? parseFloat(l2gal(totalWaterVol).toFixed(4)) : totalWaterVol : undefined,
      grainWeight ? units === 'metric' ? parseFloat(kg2lb(grainWeight).toFixed(4)) : grainWeight : undefined,
      equipmentLoss,
      absorptionRate,
      batchType
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      vol = props.labels.vol;
      return units === 'metric' ? parseFloat(gal2l(result).toFixed(2)) : result;
    }
  }

  return (
    <div>
      <h2>Pre-Boil Volume</h2>
      <div>
        <label htmlFor="batchType">Batch Type</label><br />
        <Select
          options={[
            {option: 'All Grain', value: 'allGrain'},
            {option: 'BIAB', value: 'BIAB'},
          ]}
          value={batchType}
          onChange={(e) => setBatchType(e.currentTarget.value as string)}
          className="capitalize darkInput"
        />
        <label htmlFor="totalWaterVol">Total Water Volume ({props.labels.vol})</label><br />
        <input
          name="totalWaterVol"
          type="number"
          value={totalWaterVol}
          onChange={(e) => setTotalWaterVol(e.target.value)}
        ></input><br />
        <label htmlFor="grainWeight">Malt Weight ({props.labels.largeWeight})</label><br />
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
