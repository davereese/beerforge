import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import styles from './Forms.module.scss';
import { BrewInterface, FermentableInterface } from '../../store/BrewContext';
import { useUser } from '../../store/UserContext';
import { lb2kg, kg2lb, SRM, OG } from '../../resources/javascript/calculator';
import { pen } from '../../resources/javascript/penSvg.js';
import Select from '../Select/Select';

interface Props {
  brew: BrewInterface;
  editingData: FermentableInterface;
  dataUpdated: Function;
}

async function listAllFermentables() {
  try {
    return await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ingredients/fermentables`)
      .then(result => {
        return result.data;
      });
  } catch (error) {
    console.log(error);
  }
}

function AddFermentableForm(props: Props) {
  const [user] = useUser();
  const [formData, setFormData] = useState<FermentableInterface>({});
  const [fermentables, setFermentables] = useState<FermentableInterface[]>([]);
  const [projectedTotalSRM, setProjectedTotalSRM] = useState<number>(props.brew.srm ? props.brew.srm : 0);
  const [projectedOG, setProjectedOG] = useState<number>(props.brew.og ? props.brew.og : 0);
  const [editOG, setEditOG] = useState<boolean>(false);
  const [targetOG, setTargetOG] = useState<number>(props.brew.fermentableUnits === 'percent'
    ? props.brew.targetOG
      ? props.brew.targetOG
      : props.brew.og ? props.brew.og : 1.000
    : props.brew.og ? props.brew.og : 1.000
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    let dataToSet: FermentableInterface[] = [];
    const fermentablesArray = props.brew.fermentables ? [...props.brew.fermentables] : [];
    const index = props.editingData && props.editingData.index ? props.editingData.index : -1;

    if (index > -1) {
      dataToSet = [...fermentablesArray];
      // index is passed as +1, so we need to subtract 1
      dataToSet.splice(index-1, 1, formData);
    } else {
      dataToSet = [...fermentablesArray, formData];
    }

    // Update the projected SRM and OG
    let fermentablesToCalculate = [...props.brew.fermentables];
    // if we are editing a fermentable, remove it's index from the list here and add it back
    // below so we don't end up with duplicates
    if (props.editingData !== null) {
      // @ts-ignore-line
      fermentablesToCalculate.splice(props.editingData.index-1, 1);
    }
    if (props.brew.mashEfficiency && props.brew.batchSize) {
      const pointsNeeded = parseFloat((((targetOG - 1) * 1000) * props.brew.batchSize).toPrecision(3));
      const weightNeeded = parseFloat((pointsNeeded / ((props.brew.mashEfficiency / 100) * 36)).toFixed(2));
      if (formData.units === 'percent') {
        fermentablesToCalculate.map(fermentable => {
          const fermentableWeight = fermentable.weight ? fermentable.weight : 0;
          return fermentable.calculatedWeight = parseFloat((weightNeeded * (fermentableWeight / 100)).toFixed(2));
        });
      }
      const brewsMalts = (formData.id && formData.id > 0) || (formData.custom && formData.custom.length > 0)
        ? [...fermentablesToCalculate, {
            potential: formData.potential ? formData.potential : 0,
            weight: formData.weight ? formData.weight : 0,
            calculatedWeight: parseFloat((weightNeeded * ((formData.weight ? formData.weight : 0) / 100)).toFixed(2)),
            lovibond: formData.lovibond ? formData.lovibond : 0
          }]
        : fermentablesToCalculate;
      const srm = SRM(brewsMalts, props.brew.batchSize, formData.units);
      setProjectedTotalSRM(srm ? srm : 0);
      setProjectedOG(OG(brewsMalts, props.brew.mashEfficiency, props.brew.batchSize));
    }

    // this lastIndex stuff is a check to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const name = dataToSet[lastIndex].name ? dataToSet[lastIndex].name : dataToSet[lastIndex].custom;
    if (name && name.length > 0) {
      props.dataUpdated(
        {...props.brew, fermentables: dataToSet},
        {targetOG: targetOG, units: formData.units}
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, targetOG]);

  useEffect(() => {
    // load fermentables when component renders
    listAllFermentables().then(result => {
      setFermentables(result);
    });
    if (props.brew.fermentableUnits === 'percent') {
      setFormData({...formData, units: 'percent'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // reset form when submitted
    if (props.brew.fermentableUnits === 'percent') {
      setFormData({id: 0, units: 'percent'});
    } else {
      setFormData({id: 0});
    }
  }, [props.brew]);

  useEffect(() => {
    // if the form's editingData changes, we've selected something to edit.
    // set the form default valies to be the data we're editing.
    if (props.editingData !== null) {
      if (props.brew.fermentableUnits === 'percent') {
        setFormData({...props.editingData, units: 'percent'});
      } else {
        setFormData(props.editingData);
      }
    } else {
      if (props.brew.fermentableUnits === 'percent') {
        setFormData({id: 0, units: 'percent'});
      } else {
        setFormData({id: 0});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editingData]);

  useEffect(() => {
    // focus on target og input
    if (editOG === true && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editOG]);

  const dataChanged = (type: string) => (event: any) => {
    let data: FermentableInterface = {};
    if (type === 'fermentable') {
      const choice = fermentables.find(fermentable => fermentable.id === parseInt(event.currentTarget.value));
      data = choice ? choice : {};
    } else if (type === 'custom') {
      data.custom = event.currentTarget.value;
    } else if (type === 'weight') {
      data.weight = formData.units !== 'percent' && user.units === 'metric'
        ? kg2lb(Number(event.currentTarget.value) + 0)
        : Number(event.currentTarget.value) + 0;
    } else if (type === 'units') {
      data.units = event.currentTarget.value;
    } else {
      data[type] = Number(event.currentTarget.value) + 0;
    }

    if (data !== undefined) {
      if (type === 'custom' && !formData['custom']) {
        data['id'] = undefined;
        data['extract'] = undefined;
        data['lovibond'] = undefined;
        data['name'] = '';
        data['origin'] = '';
        data['potential'] = undefined;
      } else if (type === 'fermentable' && formData['custom']) {
        data['custom'] = '';
      }

      setFormData({...formData, ...data});
    }
  };

  const editOGInput = <input
      id="editOG"
      className={styles.inline}
      ref={inputRef}
      type="number"
      step="0.001"
      placeholder="1.000"
      min="0"
      value={targetOG}
      onChange={(event) => setTargetOG(Number(event.currentTarget.value))}
      onBlur={() => setEditOG(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setEditOG(false)
        }
      }}
    />;

  return(
    <>
      <label>Select Fermentable<br />
        <Select
          options={[
            {option: "Choose Fermentable", value: 0},
            ...fermentables.map(fermentable => ({
              label: fermentable.name,
              option: <div className={styles.gridOption3Col}>
                  <span>{fermentable.name}</span>
                  <span className={styles.yellow}>{fermentable.origin}</span>
                  <span className={styles.yellow}>{fermentable.lovibond}°L</span>
                </div>,
              value: fermentable.id || ""
            }))
          ]}
          value={formData.id ? formData.id : 0}
          onChange={dataChanged('fermentable')}
          className={`capitalize lightInput ${formData.custom ? styles.unused : ''}`}
          useSearch
        />
      </label>
      <label><strong>Or</strong> add your own<br />
        <input
          type="text"
          placeholder="Fermentable Name"
          value={formData.custom ? formData.custom : ''}
          onChange={dataChanged('custom')}
          className={!formData.custom ? styles.unused : ''}
        />
      </label>
      {formData.custom
        ? <div className={styles.row}>
            <label>Lovibond (color)<br />
              <input
                type="number"
                step="0.1"
                placeholder="1"
                min="0"
                value={formData.lovibond ? formData.lovibond : ''}
                onChange={dataChanged('lovibond')}
              />
            </label>
            <label>Conversion Potential<br />
              <input
                type="number"
                step="1"
                placeholder="34"
                min="0"
                value={formData.potential ? formData.potential : ''}
                onChange={dataChanged('potential')}
              />
            </label>
          </div>
        : null }
      <div className={styles.row}>
        <label>Weight ({formData.units === 'percent'
          ? '%'
          : user.units === 'metric' ? 'kg' : 'lb'})<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            min="0"
            value={formData.weight
              ? formData.units !== 'percent' && user.units === 'metric'
                ? parseFloat(lb2kg(formData.weight).toFixed(5))
                : formData.weight
              : ''}
            onChange={dataChanged('weight')}
          />
        </label>
        <label>Units<br />
        <Select
          options={[
            {option: user.units === 'metric' ? 'kg' : 'lb', value: user.units === 'metric' ? 'kg' : 'lb'},
            {option: 'percent', value: "percent"},
          ]}
          value={formData.units
            ? formData.units
            : user.units === 'metric' ? 'kg' : 'lb'}
          onChange={dataChanged('units')}
          className="lightInput"
        />
        </label>
      </div>
      <p className={styles.extra}>
        {props.brew.srm || (formData.lovibond && formData.weight && props.brew.batchSize)
          ? <>Projected SRM: <strong>{projectedTotalSRM}</strong><br /></>
          : null}
        {props.brew.srm || (formData.lovibond && formData.weight && props.brew.batchSize)
          ? formData.units === 'percent'
              ? <>Target OG: <strong>{editOG === true ? editOGInput : Number(targetOG).toFixed(3)}</strong></>
              : <>Projected OG: <strong>{Number(projectedOG).toFixed(3)}</strong></>
          : null}
        {(props.brew.srm || (formData.lovibond && formData.weight && props.brew.batchSize)) && formData.units === 'percent'
          // if the brew is using percentages, show the OG editing buttons
          ? <span className={styles.alignRight}>
              <button
                className={`button button--link ${styles.edit}`}
                onClick={() => setEditOG(!editOG)}
              >{pen}</button>
              {/* // Not supporing unlocked OG if fermentable units is percent right now
              <button
                className={`button button--link ${lockOG ? styles.lock : styles.unlock}`}
                onClick={() => setLockOG(!lockOG)}
              >{lockOG ? locked : unlocked}</button> */}
            </span>
          : null}
      </p>
    </>
  );
};

export default AddFermentableForm;