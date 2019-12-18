import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './Forms.module.scss';
import { BrewInterface, AdjunctInterface } from '../../Store/BrewContext';
import { ADJUNCT_TYPES, UNITS, ADJUNCT_USE } from '../../resources/javascript/constants';

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
          type: choice.type,
          use: choice.use,
          units: 'g'
        }
        : {};
    } else if (type === 'time' || type === 'amount') {
      data[type] = Number(event.currentTarget.value) + 0;
    } else {
      data[type] = event.currentTarget.value;
    }

    if (data !== undefined) {
      if (type === 'custom' && !formData['custom']) {
        data['id'] = undefined;
        data['type'] = 'fining';
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
    const adjunctsArray = props.brew.adjuncts ? [...props.brew.adjuncts] : [];
    let dataToSet: AdjunctInterface[] = [];
    const index = adjunctsArray.findIndex(adjunct => adjunct === props.editingData);

    if (index > -1) {
      dataToSet = adjunctsArray;
      dataToSet.splice(index, 1, formData);
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
        <select
          onChange={dataChanged('adjunct')}
          value={formData.id ? formData.id : 0}
          className={formData.custom ? styles.unused : ''}
        >
          <option value="0">Choose One</option>
          {adjuncts.map(adjunct => (
            <option value={adjunct.id} key={adjunct.id}>{adjunct.name} - {adjunct.type}</option>
          ))}
        </select>
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
            <select
              onChange={dataChanged('type')}
              value={formData.type ? formData.type : 0}
              className="capitalize"
            >
              {ADJUNCT_TYPES.map(type => {
                return <option value={type} key={type}>{type}</option>;
              })}
            </select>
          </label>
        : null}
      <div className={styles.row}>
        <label>Amount<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.amount ? formData.amount.toString() : ''}
            onChange={dataChanged('amount')}
          />
        </label>
        <label>Units<br />
          <select
              onChange={dataChanged('units')}
              value={formData.units ? formData.units : 0}
            >
              {UNITS.map(unit => {
                return <option value={unit} key={unit}>{unit}</option>;
              })}
            </select>
        </label>
      </div>
      <div className={styles.row}>
        <label>Use<br />
          <select
            onChange={dataChanged('use')}
            value={formData.use ? formData.use : 0}
            className="capitalize"
          >
            {ADJUNCT_USE.map(use => {
              return <option value={use} key={use}>{use}</option>;
            })}
          </select>
        </label>
        <label>Time ({formData.use === 'mash' || formData.use === 'boil' ? 'min' : 'days'})<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.time ? formData.time : ''}
            onChange={dataChanged('time')}
          />
        </label>
      </div>
    </>
  );
};

export default AddAdjunctsForm;