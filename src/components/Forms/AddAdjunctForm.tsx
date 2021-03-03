import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './Forms.module.scss';
import { BrewInterface, AdjunctInterface } from '../../store/BrewContext';
import { ADJUNCT_TYPES, UNITS, ADJUNCT_USE } from '../../resources/javascript/constants';
import { getAdjunctById } from '../../resources/javascript/functions';
import Select from '../Select/Select';

interface Props {
  brew: BrewInterface;
  editingData: AdjunctInterface;
  dataUpdated: Function;
}

async function listAllAdjuncts() {
  try {
    return await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ingredients/adjuncts`)
      .then(result => {
        return result.data;
      });
  } catch (error) {
    console.log(error);
  }
}

function AddAdjunctsForm(props: Props) {
  const [formData, setFormData] = useState<AdjunctInterface>({});
  const [adjuncts, setAdjuncts] = useState<AdjunctInterface[]>([]);

  const dataChanged = (type: string) => (event: any) => {
    let data: AdjunctInterface = {};
    if (type === 'adjunct') {
      const choice = adjuncts.find(adjunct => adjunct.id === parseInt(event.currentTarget.value));
      data = choice
        ? {
          id: choice.id,
          name: choice.name,
          category: choice.category,
          use: choice.use,
          units: 'g'
        }
        : {};
    } else if (type === 'time' || type === 'amount' || type === "category") {
      data[type] = !!event.currentTarget.value ? +event.currentTarget.value : undefined;
    } else {
      data[type] = event.currentTarget.value;
    }

    if (data !== undefined) {
      if (type === 'custom' && !formData['custom']) {
        data['id'] = undefined;
        data['category'] = 1;
        data['use'] = 'mash';
        data['name'] = '';
        data['units'] = '';
      } else if (type === 'adjunct' && formData['custom']) {
        data['custom'] = '';
      }

      setFormData({...formData, ...data});
    }
  };

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    let dataToSet: AdjunctInterface[] = [];
    const adjunctsArray = props.brew.adjuncts ? [...props.brew.adjuncts] : [];
    const index = props.editingData && props.editingData.index ? props.editingData.index : -1;

    if (index > -1) {
      dataToSet = [...adjunctsArray];
      // index is passed as +1, so we need to subtract 1
      dataToSet.splice(index-1, 1, formData);
    } else {
      dataToSet = [...adjunctsArray, formData];
    }

    // this lastIndex stuff is a check to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const name = dataToSet[lastIndex].name ? dataToSet[lastIndex].name : dataToSet[lastIndex].custom;
    if (name && name.length > 0) {
      props.dataUpdated({...props.brew, adjuncts: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // load adjuncts when component renders
    listAllAdjuncts().then(result => {
      setAdjuncts(result);
    });
  }, []);

  useEffect(() => {
    // reset form when submitted
    setFormData({id: 0});
  }, [props.brew]);

  useEffect(() => {
    // if the form's editingData changes, we've selected something to edit.
    // set the form default valies to be the data we're editing.
    if (props.editingData !== null) {
      setFormData(props.editingData);
    } else {
      setFormData({id: 0});
    }
  }, [props.editingData]);

  return(
    <>
      <label>Select Adjunct<br />
        <Select
          options={[
            {option: "Choose Adjunct", value: 0},
            ...adjuncts.map(adjunct => ({
              label: adjunct.name,
              option: <div className={styles.gridOption2Col}>
                  <span>{adjunct.name}</span>
                  <span className={styles.yellow}>{getAdjunctById(adjunct.category)}</span>
                </div>,
              value: adjunct.id || ""
            }))
          ]}
          value={formData.id ? formData.id : 0}
          onChange={dataChanged('adjunct')}
          className={`capitalize lightInput ${formData.custom ? styles.unused : ''}`}
        />
      </label>
      <label><strong>Or</strong> add your own<br />
        <input
          type="text"
          placeholder="Adjunct Name"
          value={formData.custom ? formData.custom : ''}
          onChange={dataChanged('custom')}
          className={!formData.custom ? styles.unused : ''}
        />
      </label>
      {formData.custom
        ? <label>Type<br />
            <Select
              options={ADJUNCT_TYPES.map(type => (
                {option: type.label, value: type.value}
                ))}
              value={formData.category ? formData.category : 0}
              onChange={dataChanged('category')}
              className="capitalize lightInput"
            />
          </label>
        : null}
      <div className={styles.row}>
        <label>Amount<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            min="0"
            value={formData.amount !== undefined && formData.amount !== null ? formData.amount : ''}
            onChange={dataChanged('amount')}
          />
        </label>
        <label>Units<br />
          <Select
            options={UNITS.map(unit => (
              {option: unit, value: unit}
            ))}
            value={formData.units ? formData.units : 'g'}
            onChange={dataChanged('units')}
            className="lightInput"
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>Use<br />
        <Select
            options={ADJUNCT_USE.map(use => (
              {option: use, value: use}
            ))}
            value={formData.use ? formData.use : "mash"}
            onChange={dataChanged('use')}
            className="capitalize lightInput"
          />
        </label>
        <label>Time ({formData.use === 'mash' || formData.use === 'boil' ? 'min' : 'days'})<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            min="0"
            value={formData.time !== undefined && formData.time !== null ? formData.time : ''}
            onChange={dataChanged('time')}
          />
        </label>
      </div>
    </>
  );
};

export default AddAdjunctsForm;