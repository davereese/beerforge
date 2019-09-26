import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from "./Forms.module.scss"
import { pitchingRate } from '../../resources/javascript/calculator';
import { BrewInterface, YeastInterface } from '../../Store/BrewContext';

interface Props {
  brew: BrewInterface;
  editingData: YeastInterface;
  dataUpdated: Function;
}

interface yeastResults extends YeastInterface {
  cell_count: number;
  average_attenuation: number;
  manufacturer: string;
}

async function listAllYeast() {
  try {
    return await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ingredients/yeast`)
      .then(result => {
        return result.data;
      });
  } catch (error) {
    console.log(error);
  }
}

function AddYeastForm(props: Props) {
  const [formData, setFormData] = useState<YeastInterface>({});
  const [yeast, setYeast] = useState<yeastResults[]>([]);

  const dataChanged = (field: string) => (event: any) => {
    let data: YeastInterface = {};
    if (field === 'yeast') {
      const choice = yeast.find(item => item.id === parseInt(event.currentTarget.value));
      data = choice
        ? {
          id: choice.id,
          name: choice.name,
          manufacturer: choice.manufacturer,
          type: choice.type,
          cellCount: choice.cell_count,
          averageAttenuation: choice.average_attenuation,
        }
        : {};
    } else if (field === 'mfgDate' || field === 'custom' || field === 'type') {
      data[field] = event.currentTarget.value;
    } else {
      data[field] = Number(event.currentTarget.value) + 0;
    }

    if (data !== undefined) {
      if (field === 'custom' && !formData['custom']) {
        data['id'] = undefined;
        data['name'] = '';
        data['averageAttenuation'] = undefined;
        data['cellCount'] = undefined;
        data['type'] = '';
        data['mfgDate'] = undefined;
        data['manufacturer'] = undefined;
      } else if (field === 'yeast' && formData['custom']) {
        data['custom'] = '';
        data['manufacturer'] = '';
      }

      data.viableCellCount = pitchingRate(
        data.type ? data.type : formData.type,
        data.cellCount ? data.cellCount : formData.cellCount,
        data.amount ? data.amount : formData.amount,
        data.mfgDate ? data.mfgDate : formData.mfgDate
      );

      setFormData({...formData, ...data});
    }
  };

  const calculateViableCells = () => {
    let viableCells = (props.brew.pitchCellCount ? props.brew.pitchCellCount : 0)
        + (formData && formData.viableCellCount ? formData.viableCellCount : 0);
    if (props.editingData !== null) {
      viableCells -= props.editingData.viableCellCount ? props.editingData.viableCellCount : 0;
    }

    return parseFloat(viableCells.toPrecision(3));
  }

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    const yeastArray = props.brew.yeast ? [...props.brew.yeast] : [];
    let dataToSet: YeastInterface[] = [];
    const index = yeastArray.findIndex(item => item === props.editingData);

    if (index > -1) {
      dataToSet = yeastArray;
      dataToSet.splice(index, 1, formData);
    } else {
      dataToSet = [...yeastArray, formData];
    }

    // this lastIndex stuff is a chack to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const name = dataToSet[lastIndex].name ? dataToSet[lastIndex].name : dataToSet[lastIndex].custom;
    if (name && name.length > 0) {
      props.dataUpdated({...props.brew, yeast: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // load yeast when component renders
    listAllYeast().then(result => {
      setYeast(result);
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
      <label>Yeast<br />
        <select
          onChange={dataChanged('yeast')}
          value={formData.id ? formData.id : 0}
          className={formData.custom ? styles.unused : ''}
        >
          <option value="0">Choose Yeast</option>
          {yeast.map(item => (
            <option value={item.id} key={item.id}>{item.manufacturer} - {item.name}</option>
          ))}
        </select>
      </label>
      <label><strong>Or</strong> add your own<br />
        <input
          type="text"
          placeholder="Yeast Name"
          value={formData.custom ? formData.custom : ''}
          onChange={dataChanged('custom')}
          className={!formData.custom ? styles.unused : ''}
        />
      </label>
      {formData.custom
        ? <>
            <select
              onChange={dataChanged('type')}
              value={formData.type ? formData.type : 0}
            >
              <option value="0">Choose Type</option>
              <option value="liquid">Liquid</option>
              <option value="dry">Dry</option>
            </select>
            <div className={styles.row}>
              <label>Cell Count<br />
                <input
                  type="number"
                  step="10" 
                  placeholder="100"
                  value={formData.cellCount ? formData.cellCount.toString() : ''}
                  onChange={dataChanged('cellCount')}
                />
              </label>
              <label>Avg. Attenuation<br />
                <input
                  type="number"
                  step="1" 
                  placeholder="75"
                  value={formData.averageAttenuation ? formData.averageAttenuation.toString() : ''}
                  onChange={dataChanged('averageAttenuation')}
                />
              </label>
            </div>
          </>
        : null}
      <label>Number of Packs<br />
        <input
          type="number"
          step="0.01" 
          placeholder="0"
          value={formData.amount ? formData.amount.toString() : ''}
          onChange={dataChanged('amount')}
        />
      </label>
      {formData.type === 'liquid'
          ? <label>Manufacture Date<br />
            <input
              type="date"
              value={formData.mfgDate ? formData.mfgDate.toString() : ''}
              onChange={dataChanged('mfgDate')}
            />
          </label>
        : null}
      {props.brew.yeast.length > 0 || formData.viableCellCount
        ? <p className={styles.extra}>
            <strong>
              {calculateViableCells()} bn cells {props.brew.targetPitchingCellCount
                ? <>of {props.brew.targetPitchingCellCount} bn target</>
                : null}
            </strong>
          </p>
        : null}
    </>
  );
};

export default AddYeastForm;