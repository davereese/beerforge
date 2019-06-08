import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from "./Forms.module.scss"
import { pitchingRate } from '../../resources/javascript/Calculator';
import { BrewInterface, YeastInterface } from '../../Store/BrewProvider';

interface Props {
  brew: BrewInterface;
  editingData: YeastInterface;
  dataUpdated: Function;
}

async function listAllYeast() {
  try {
    // @ts-ignore-line
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authHeaders = {'authorization': currentUser ? currentUser.token : null};
    return await axios.get('http://localhost:4000/api/ingredients/yeast', {
      headers: authHeaders,
    }).then(result => {
      return result.data;
    });
  } catch (error) {
    console.log(error);
  }
}

function AddYeastForm(props: Props) {
  const [formData, setFormData] = useState<YeastInterface>({});
  const [yeast, setYeast] = useState<YeastInterface[]>([]);

  const dataChanged = (type: string) => (event: any) => {
    let data: YeastInterface = {};
    if (type === 'yeast') {
      const choice = yeast.find(item => item.id === parseInt(event.currentTarget.value));
      data = choice ? choice : {};
    } else if (type === 'amount') {
      data.amount = Number(event.currentTarget.value) + 0;
    } else if (type === 'mfgDate') {
      data.mfgDate = event.currentTarget.value;
    }

    if (data !== undefined) {
      data.viableCellCount = pitchingRate(
        data.type ? data.type : formData.type,
        data.cell_count ? data.cell_count : formData.cell_count,
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

    const lastIndex = dataToSet.length - 1;
    if (dataToSet[lastIndex].id && dataToSet[lastIndex].id !== 0) {
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
    }
  }, [props.editingData]);

  return(
    <>
      <label>Yeast<br />
        <select
          onChange={dataChanged('yeast')}
          value={formData.id}
        >
          <option value="0">Choose Yeast</option>
          {yeast.map(item => (
            <option value={item.id} key={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
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