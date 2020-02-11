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
    } else if (field === 'mfgDate' || field === 'custom' || field === 'type' || field === 'units') {
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

      data.viableCellCount = data.units === 'cells' || formData.units === 'cells'
        ? data.amount
        : pitchingRate(
            data.type ? data.type : formData.type,
            data.cellCount ? data.cellCount : formData.cellCount,
            data.amount ? data.amount : formData.amount,
            props.brew.dateBrewed ? props.brew.dateBrewed : new Date(),
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
    let dataToSet: YeastInterface[] = [];
    const yeastArray = props.brew.yeast ? [...props.brew.yeast] : [];
    const index = props.editingData && props.editingData.index ? props.editingData.index : -1;

    if (index > -1) {
      dataToSet = [...yeastArray];
      // index is passed as +1, so we need to subtract 1
      dataToSet.splice(index-1, 1, formData);
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
    setFormData({id: 0, units: 'pkg'});
  }, [props.brew]);

  useEffect(() => {
    // if the form's editingData changes, we've selected something to edit.
    // set the form default valies to be the data we're editing.
    if (props.editingData !== null) {
      setFormData(props.editingData);
    } else {
      setFormData({id: 0, units: 'pkg'});
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
                  value={formData.cellCount ? formData.cellCount : ''}
                  onChange={dataChanged('cellCount')}
                />
              </label>
              <label>Avg. Attenuation<br />
                <input
                  type="number"
                  step="1" 
                  placeholder="75"
                  value={formData.averageAttenuation ? formData.averageAttenuation: ''}
                  onChange={dataChanged('averageAttenuation')}
                />
              </label>
            </div>
          </>
        : null}
      <div className={styles.row}>
        <label>Amount<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.amount ? formData.amount : ''}
            onChange={dataChanged('amount')}
          />
        </label>
        <label>Units<br />
          <select
              onChange={dataChanged('units')}
              value={formData.units ? formData.units : 0}
            >
              <option value='pkg'>pkg</option>
              <option value='cells'>billion cells</option>
            </select>
        </label>
      </div>
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
              {calculateViableCells()} bn</strong> cells {props.brew.targetPitchingCellCount
                ? <>of <strong>{props.brew.targetPitchingCellCount} bn</strong> target</>
                : null}
          </p>
        : null}
    </>
  );
};

export default AddYeastForm;