import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './Forms.module.scss';
import Info from "../Info/Info";
import { BrewInterface, HopInterface } from '../../Store/BrewContext';
import { IBU } from '../../resources/javascript/calculator';
import { useUser } from '../../Store/UserContext';
import { oz2g, g2oz } from '../../resources/javascript/calculator';
import { HOP_USE } from '../../resources/javascript/constants';

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
    return await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ingredients/hops`)
      .then(result => {
        return result.data;
      });
  } catch (error) {
    console.log(error);
  }
}

function AddHopForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
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
            use: 'boil'
          }
        : {};
    } else if (type === 'form' || type === 'custom') {
      data[type] = event.currentTarget.value;
    } else if (type === 'use' || type === 'custom') {
      data[type] = event.currentTarget.value;
      if (data[type] !== 'dry hop') { data['days'] = undefined; }
      if (data[type] !== 'boil') { data['lengthInBoil'] = undefined; }
      if (data[type] !== 'first wort') { data['multiplier'] = undefined; }
      if (data[type] === 'first wort') { data['multiplier'] = 10; }
    } else if (type === 'weight') {
      data.weight = user.units === 'metric' ? g2oz(Number(event.currentTarget.value) + 0) : Number(event.currentTarget.value) + 0;
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
      
      if (type === 'custom' && !formData['custom']) {
        data['id'] = undefined;
        data['name'] = '';
        data['alphaAcid'] = undefined;
      } else if (type === 'hop' && formData['custom']) {
        data['custom'] = '';
      }

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

    // this lastIndex stuff is a chack to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const name = dataToSet[lastIndex].name ? dataToSet[lastIndex].name : dataToSet[lastIndex].custom;
    if (name && name.length > 0) {
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
          value={formData.id ? formData.id : 0}
          className={formData.custom ? styles.unused : ''}
        >
          <option value="0">Choose Hop</option>
          {hops.map(hop => (
            <option value={hop.id} key={hop.id}>{hop.name}</option>
          ))}
        </select>
      </label>
      <label><strong>Or</strong> add your own<br />
        <input
          type="text"
          placeholder="Hop Name"
          value={formData.custom ? formData.custom : ''}
          onChange={dataChanged('custom')}
          className={!formData.custom ? styles.unused : ''}
        />
      </label>
      <div className={styles.row}>
        <label>Use<br />
          <select
            onChange={dataChanged('use')}
            value={formData.use ? formData.use : 0}
            className="capitalize"
          >
            {HOP_USE.map(use => {
              return <option value={use} key={use}>{use}</option>;
            })}
          </select>
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
      <div className={
        formData.use === 'boil'
        || formData.use === 'dry hop'
        || formData.use === 'first wort'
          ? styles.rowThirds
          : styles.row
      }>
        <label>Alpha Acid<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.alphaAcid ? formData.alphaAcid.toString() : ''}
            onChange={dataChanged('alphaAcid')}
          />
        </label>
        <label>Weight ({user.units === 'metric' ? 'g' : 'oz'})<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={formData.weight ? user.units === 'metric' ? parseFloat(oz2g(formData.weight).toFixed(5)) : formData.weight.toString() : ''}
            onChange={dataChanged('weight')}
          />
        </label>
        {formData.use === 'boil'
          ? <label>Time (min)<br />
              <input
                type="number"
                step="1"
                placeholder="0"
                value={formData.lengthInBoil !== undefined && formData.lengthInBoil !== null ? formData.lengthInBoil.toString() : ''}
                onChange={dataChanged('lengthInBoil')}
              />
            </label>
          : null}
        {formData.use === 'first wort'
          ? <label>Multiplier %&nbsp;
            <Info
              alignment="top-right"
              info="First&nbsp;wort&nbsp;hopping&nbsp;generally adds about 10% to your ibu calculation using the total boil time. Setting the multiplier to 0 would be the same calculation as a hop addition for the full boil."
            /><br />
              <input
                type="number"
                step="1"
                placeholder="10"
                value={formData.multiplier !== undefined && formData.multiplier !== null ? formData.multiplier.toString() : ''}
                onChange={dataChanged('multiplier')}
              />
            </label>
          : null}
        {formData.use === 'dry hop'
          ? <label>Days<br />
              <input
                type="number"
                step="1"
                placeholder="0"
                value={formData.days !== undefined ? formData.days.toString() : ''}
                onChange={dataChanged('days')}
              />
            </label>
          : null}
      </div>
    </>
  );
};

export default AddHopForm;