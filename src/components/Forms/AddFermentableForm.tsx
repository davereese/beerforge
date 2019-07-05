import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BrewInterface, FermentableInterface } from '../../Store/BrewProvider';

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
  const [formData, setFormData] = useState<FermentableInterface>({});
  const [fermentables, setFermentables] = useState<FermentableInterface[]>([]);

  const dataChanged = (type: string) => (event: any) => {
    let data: FermentableInterface = {};
    if (type === 'fermentable') {
      const choice = fermentables.find(fermentable => fermentable.id === parseInt(event.currentTarget.value));
      data = choice ? choice : {};
    } else if (type === 'weight') {
      data.weight = Number(event.currentTarget.value) + 0;
    }

    if (data !== undefined) {
      setFormData({...formData, ...data});
    }
  };

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    const fermentablesArray = props.brew.fermentables ? [...props.brew.fermentables] : [];
    let dataToSet: FermentableInterface[] = [];
    const index = fermentablesArray.findIndex(fermentable => fermentable === props.editingData);

    if (index > -1) {
      dataToSet = fermentablesArray;
      dataToSet.splice(index, 1, formData);
    } else {
      dataToSet = [...fermentablesArray, formData];
    }

    const lastIndex = dataToSet.length - 1;
    if (dataToSet[lastIndex].id && dataToSet[lastIndex].id !== 0) {
      props.dataUpdated({...props.brew, fermentables: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // load fermentables when component renders
    listAllFermentables().then(result => {
      setFermentables(result);
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
      <label>Fermentable<br />
        <select
          onChange={dataChanged('fermentable')}
          value={formData.id}
        >
          <option value="0">Choose Malt</option>
          {fermentables.map(fermentable => (
            <option value={fermentable.id} key={fermentable.id}>{fermentable.name}</option>
          ))}
        </select>
      </label><br />
      <label>Weight (lbs)<br />
        <input
          type="number"
          step="0.01"
          placeholder="0"
          value={formData.weight ? formData.weight.toString() : ''}
          onChange={dataChanged('weight')}
        />
      </label>
    </>
  );
};

export default AddFermentableForm;