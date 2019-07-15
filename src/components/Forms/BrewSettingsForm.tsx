import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import Info from '../Info/Info';
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
  delete: Function;
}

function BrewSettingsForm(props: Props) {
  const [formData, setFormData] = useState({
    ...props.brew,
    targetPitchingRate: props.brew.targetPitchingRate ? props.brew.targetPitchingRate : '0.75'
  });

  const dataChanged = (type: string) => (event: any) => {
    let data;
    if (type === 'dateBrewed') {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      data = `${event.currentTarget.value}T${hours}:${minutes}`;
    } else {
      data = event.currentTarget.value;
    }
    setFormData({...formData, [type]: data});
  };

  const getFormattedDate = (date: string | Date) => {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear();
  
    return (`${year}-${month}-${day}`);
  }

  useEffect(() => {
    props.dataUpdated(formData);
  }, [formData, props]);

  return(
    <>
      <label>
        Name<br />
        <input
          type="text"
          placeholder="New Brew"
          defaultValue={`${props.brew.name}`}
          onChange={dataChanged('name')}
        />
      </label>
      {props.brew.id
        ? <label>Date Brewed<br />
            <input
              type="date"
              defaultValue={props.brew.dateBrewed ? getFormattedDate(props.brew.dateBrewed).toString() : ''}
              onChange={dataChanged('dateBrewed')}
            />
          </label>
        : null}
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
          Batch Size (gal) <Info alignment="top-right" info="Volume of wort you expect to transfer to the&nbsp;fermentor." /><br />
          <input
            type="number"
            placeholder="6"
            defaultValue={`${props.brew.batchSize}`}
            onChange={dataChanged('batchSize')}
          />
        </label>
        <label>
          System Efficiency (%) <Info alignment="top-right" info="Mash&nbsp;extraction efficiency in percentage." /><br />
          <input
            type="number"
            placeholder="75"
            defaultValue={`${props.brew.systemEfficiency}`}
            onChange={dataChanged('systemEfficiency')}
          />
        </label>
      </div>
      <label>
        Strike Temperature Adjustment Factor <Info alignment="top-right" info="Equipment&nbsp;losses. You may need to dial this in over time." /><br />
        <input
          placeholder="0"
          type="number"
          defaultValue={`${props.brew.strikeTempFactor}`}
          onChange={dataChanged('strikeTempFactor')}
        />
      </label>
      <label>
        Target Pitching Rate (million cells / ml / °Plato) <Info alignment="top-right" info="It is reccommended to use a rate highter than&nbsp;the&nbsp;manufacturer's." /><br />
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
      {props.brew.id
        ? <button className={`button button--error button--no-shadow ${styles.fullButton}`} onClick={() => props.delete()}>Remove Brew</button>
        : null}
    </>
  );
};

export default BrewSettingsForm;