import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from "./Forms.module.scss"
import { BrewInterface, HopInterface } from '../../Store/BrewProvider';
import { IBU } from "../../resources/javascript/Calculator";

interface Props {
  brew: BrewInterface;
  editingData: HopInterface;
  dataUpdated: Function;
}

interface HopResults extends HopInterface {
  average_alpha: number;
}

async function listAllHops() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const authHeaders = {'authorization': currentUser ? currentUser.token : null};
    return await axios.get('http://localhost:4000/api/ingredients/hops', {
      headers: authHeaders,
    }).then(result => {
      return result.data;
    });
  } catch (error) {
    console.log(error);
  }
}

function AddHopForm(props: Props) {
  const [formData, setFormData] = useState<HopInterface>({});
  const [hops, setHops] = useState<HopResults[]>([]);

  const dataChanged = (type: string) => (event: any) => {
    let data: HopInterface = {};
    if (type === 'hop') {
      const choice = hops.find(hop => hop.id === parseInt(event.currentTarget.value));
      data = choice
        ? {
          id: choice.id,
          name: choice.name,
          alphaAcid: Number(choice.average_alpha),
          form: 'pellet',
          }
        : {};
    } else if (type === 'form') {
      data[type] = event.currentTarget.value;
    } else {
      data[type] = Number(event.currentTarget.value) + 0;
    }

    if (data !== undefined) {
      data.ibu = IBU(
        [{...formData, ...data}],
        props.brew.og,
        props.brew.batchSize,
        'rager'
      );
      setFormData({...formData, ...data});
    }
  };

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    const hopsArray = props.brew.hops ? [...props.brew.hops] : [];
    let dataToSet: HopInterface[] = [];
    const index = hopsArray.findIndex(hop => hop === props.editingData);

    if (index > -1) {
      dataToSet = hopsArray;
      dataToSet.splice(index, 1, formData);
    } else {
      dataToSet = [...hopsArray, formData];
    }

    const lastIndex = dataToSet.length - 1;
    if (dataToSet[lastIndex].id && dataToSet[lastIndex].id !== 0) {
      props.dataUpdated({...props.brew, hops: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // load hops when component renders
    listAllHops().then(result => {
      setHops(result);
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
      <label>Hop<br />
        <select
          onChange={dataChanged('hop')}
          value={formData.id}
        >
          <option value="0">Choose Hop</option>
          {hops.map(hop => (
            <option value={hop.id} key={hop.id}>{hop.name}</option>
          ))}
        </select>
      </label>
      <div className={styles.row}>
        <label>Alpha Acid<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.alphaAcid ? formData.alphaAcid.toString() : ''}
            onChange={dataChanged('alphaAcid')}
          />
        </label>
        <label>Form<br />
          <select
            onChange={dataChanged('form')}
            value={formData.form ? formData.form.toString() : ''}
          >
            <option value="pellet">Pellet</option>
            <option value="leaf">Whole Leaf</option>
          </select>
        </label>
      </div>
      <div className={styles.row}>
        <label>Weight (oz)<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.weight ? formData.weight.toString() : ''}
            onChange={dataChanged('weight')}
          />
        </label>
        <label>Length in Boil (min)<br />
          <input
            type="number"
            step="1"
            placeholder="0"
            value={formData.lengthInBoil ? formData.lengthInBoil.toString() : ''}
            onChange={dataChanged('lengthInBoil')}
          />
        </label>
      </div>
    </>
  );
};

export default AddHopForm;