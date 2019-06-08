import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function BrewSettingsForm(props: Props) {
  const [formData, setFormData] = useState({
    ...props.brew,
    targetPitchingRate: props.brew.targetPitchingRate ? props.brew.targetPitchingRate : '0.75'
  });

  const dataChanged = (type: string) => (event: any) => {
    const data = event.currentTarget.value;
    setFormData({...formData, [type]: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <label>Batch Type<br />
        <select
          onChange={dataChanged('batchType')}
          defaultValue={props.brew.batchType}
        >
          <option value="">Choose One</option>
          <option value="allGrain">All Grain</option>
          <option value="BIAB">BIAB</option>
          <option value="partialMash">Partial Mash</option>
          <option value="extract">Extract</option>
        </select>
      </label>
      <div className={styles.row}>
        <label>
          Batch Size (gal)<br />
          <input
            type="number"
            placeholder="6"
            defaultValue={`${props.brew.batchSize}`}
            onChange={dataChanged('batchSize')}
          />
        </label>
        <label>
          System Efficiency (%)<br />
          <input
            type="number"
            placeholder="75"
            defaultValue={`${props.brew.systemEfficiency}`}
            onChange={dataChanged('systemEfficiency')}
          />
        </label>
      </div>
      <label>
        Strike Temperature Adjustment Factor<br />
        <input
          placeholder="0"
          type="number"
          defaultValue={`${props.brew.strikeTempFactor}`}
          onChange={dataChanged('strikeTempFactor')}
        />
      </label>
      <label>
        Target Pitching Rate (million cells / ml / °Plato)<br />
          <select
            onChange={dataChanged('targetPitchingRate')}
            defaultValue={props.brew.targetPitchingRate ? props.brew.targetPitchingRate : "0.75"}
          >
            <option value="0.35">0.35 (Mfr. rate for Ale)</option>
            <option value="0.5">0.5 (Mfr. rate for Ale)</option>
            <option value="0.75">0.75 (Ale)</option>
            <option value="1.0">1.0 (Ale)</option>
            <option value="1.25">1.25 (High OG Ale)</option>
            <option value="1.5">1.5 (Lager)</option>
            <option value="1.75">1.75 (Lager)</option>
            <option value="2.0">2.0 (High OG Lager)</option>
          </select>
      </label>
    </>
  );
};

export default BrewSettingsForm;