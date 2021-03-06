import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import styles from './Forms.module.scss';
import Info from "../Info/Info";
import { BrewInterface, HopInterface } from '../../store/BrewContext';
import { useUser } from '../../store/UserContext';
import { oz2g, g2oz, IBU, f2c, c2f } from '../../resources/javascript/calculator';
import { HOP_USE } from '../../resources/javascript/constants';
import Select from '../Select/Select';
import { usePopup } from '../../store/PopupContext';
import { getAverageAA } from '../../resources/javascript/functions';

interface Props {
  brew: BrewInterface;
  editingData: HopInterface;
  dataUpdated: Function;
}

export interface HopFlavors {
  tropical_fruit: number;
  herbal: number;
  floral: number;
  vegital: number;
  piney_resinous: number;
  grassy: number;
  spicy: number;
  citrus: number;
}

export interface HopResults {
  id: number;
  name: string;
  origin: string;
  alpha_min: number;
  alpha_max: number;
  category: "finishing" | "bittering" | "dualPurpose";
  description: string;
  flavor_profile: HopFlavors;
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
  const {dispatch: popupDispatch} = usePopup();
  const [user] = useUser();
  const [formData, setFormData] = useState<HopInterface>({});
  const [hops, setHops] = useState<HopResults[]>([]);
  const [projectedTotalIBU, setProjectedTotalIBU] = useState<number>(props.brew.ibu ?? 0);
  const timeout: any = useRef();

  useEffect(() => {
    // load hops when component renders
    listAllHops().then(result => {
      setHops(result);
    });
  }, []);

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    let dataToSet: HopInterface[] = [];
    const hopsArray = props.brew.hops ? [...props.brew.hops] : [];
    const index = props.editingData?.index ?? -1;

    if (index > -1) {
      dataToSet = [...hopsArray];
      // index is passed as +1, so we need to subtract 1
      dataToSet.splice(index-1, 1, formData);
    } else {
      dataToSet = [...hopsArray, formData];
    }

    // Update the projected IBU
    let hopsToCalculate = [...props.brew.hops];
    // if we are editing a hop, remove it's index from the list here and add it back
    // below so we don't end up with duplicates
    if (props.editingData !== null) {
      // @ts-ignore-line
      hopsToCalculate.splice(props.editingData.index-1, 1);
    }
    if (formData.use === 'first wort') {
      formData.lengthInBoil = props.brew.boilLength;
    } else if (formData.use === 'mash') {
      let mashLength = 0;
      props.brew.mash.forEach(step => {
        mashLength += step.stepLength ? Number(step.stepLength) : 0;
      });
      formData.lengthInBoil = mashLength;
    }
    const brewsHops = (formData.id && formData.id > 0) || (formData.custom && formData.custom.length > 0)
      ? [...hopsToCalculate, {
          ...formData,
          alphaAcid: formData.alphaAcid ? formData.alphaAcid : 0,
          weight: formData.weight ? formData.weight : 0,
        }]
      : hopsToCalculate;
    const ibus = IBU(brewsHops, props.brew.og, props.brew.batchSize, user.ibu_formula ? user.ibu_formula : 'rager');
    setProjectedTotalIBU(ibus ? ibus : 0);

    // this lastIndex stuff is a check to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const name = dataToSet[lastIndex].name ? dataToSet[lastIndex].name : dataToSet[lastIndex].custom;
    if (name && name.length > 0) {
      props.dataUpdated({...props.brew, hops: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // reset form when submitted
    setFormData({id: 0, use: 'boil', form: 'pellet'});
  }, [props.brew]);

  useEffect(() => {
    // if the form's editingData changes, we've selected something to edit.
    // set the form default valies to be the data we're editing.
    if (props.editingData !== null) {
      setFormData(props.editingData);
    } else {
      setFormData({id: 0, use: 'boil', form: 'pellet'});
    }
  }, [props.editingData]);

  const dataChanged = (type: string) => (event: any) => {
    clearTimeout(timeout.current);
    popupDispatch({type: 'close'});
    let data: HopInterface = {};
    if (type === 'hop') {
      const choice = hops.find(hop => hop.id === parseInt(event.currentTarget.value));
      data = choice
        ? {
            id: choice.id,
            name: choice.name,
            alphaAcid: getAverageAA(choice.alpha_min, choice.alpha_max)
          }
        : {};
    } else if (type === 'form' || type === 'custom') {
      data[type] = event.currentTarget.value;
    } else if (type === 'use' || type === 'custom') {
      data[type] = event.currentTarget.value;
      if (data[type] !== 'dry hop') {
        data['days'] = undefined;
      }
      if (data[type] !== 'boil') {
        data['lengthInBoil'] = undefined;
      }
      if (data[type] !== 'first wort') {
        data['multiplier'] = undefined;
      } else {
        data['multiplier'] = 10;
      }
      if (data[type] !== 'whirlpool') {
        data['whirlpoolTemp'] = undefined;
      }
    } else if (type === 'weight') {
      data.weight = user.units === 'metric'
        ? g2oz(Number(event.currentTarget.value) + 0)
        : Number(event.currentTarget.value) + 0;
    } else if (type === 'whirlpoolTemp') {
      data[type] =
        user.units === "metric"
          ? c2f(event.currentTarget.value)
          : event.currentTarget.value;
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

  const openPopup = (event: React.MouseEvent<HTMLInputElement>, delay: number = 500) => {
    if (+event.currentTarget.value === 0) {
      return;
    }
    const hoveredHopId = +event.currentTarget.value;
    const optionCoords = event.currentTarget.getBoundingClientRect();
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      const hoveredHop = hops.find((hop: HopResults) => hop.id === hoveredHopId);
      if (!hoveredHop || !hoveredHop.description) {
        popupDispatch({type: 'close'}); // don't show if not all the data is there
        return;
      }
      popupDispatch({
        type: 'show',
        payload: {
          ingredient: {
            name: hoveredHop.name || "",
            category: hoveredHop.category,
            details: [
              `${hoveredHop.alpha_min}-${hoveredHop?.alpha_max}% Alpha Acid`,
              hoveredHop.origin || ""
            ],
            description: hoveredHop.description,
            graph: {
              type: 'hop',
              values: [
                {
                  id: hoveredHopId,
                  category: hoveredHop.category,
                  attributes: {
                    tropical_fruit: hoveredHop.flavor_profile.tropical_fruit,
                    citrus: hoveredHop.flavor_profile.citrus,
                    floral: hoveredHop.flavor_profile.floral,
                    herbal: hoveredHop.flavor_profile.herbal,
                    piney_resinous: hoveredHop.flavor_profile.piney_resinous,
                    grassy: hoveredHop.flavor_profile.grassy,
                    spicy: hoveredHop.flavor_profile.spicy,
                    vegital: hoveredHop.flavor_profile.vegital,
                  }
                }
              ]
            }
          },
          coords: optionCoords
        }
      });
    }, delay);
  };

  const closePopup = (delay: number = 250) => {
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      popupDispatch({type: 'hide'});
    }, delay);
  };

  return(
    <>
      <label>Hop<br />
        <Select
          options={[
            ...hops.map(hop => ({
              label: hop.name,
              option: <div className={styles.gridOption3Col}>
                  <span className={`${styles.category} ${hop.category}`}>{hop.name}</span>
                  <span className={styles.yellow}>{hop.origin}</span>
                  <span className={styles.yellow}>{getAverageAA(hop.alpha_min, hop.alpha_max)}% AA</span>
                </div>,
              value: hop.id || ""
            }))
          ]}
          placeholder="Choose Hop"
          value={formData.id ? formData.id : 0}
          onChange={dataChanged('hop')}
          className={`capitalize lightInput ${formData.custom ? styles.unused : ''}`}
          useSearch
          optionHoverEffect={openPopup}
          onMouseOut={closePopup}
          dropdownClosed={() => popupDispatch({type: 'close'})}
        />
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
        <Select
          options={HOP_USE.map(use => ({
            option: use,
            value: use
          }))}
          value={formData.use ? formData.use : 'boil'}
          onChange={dataChanged('use')}
          className="capitalize lightInput"
        />
        </label>
        <label>Form<br />
          <Select
            options={[
              {option: 'Pellet', value: 'pellet'},
              {option: 'Whole Leaf', value: 'leaf'}
            ]}
            value={formData.form ? formData.form : ''}
            onChange={dataChanged('form')}
            className="capitalize lightInput"
          />
        </label>
      </div>
      <div className={
        formData.use === 'boil'
        || formData.use === 'dry hop'
        || formData.use === 'first wort'
        || formData.use === "whirlpool"
          ? styles.rowThirds
          : styles.row
      }>
        <label>Alpha Acid<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            min="0"
            value={formData.alphaAcid ? formData.alphaAcid : ''}
            onChange={dataChanged('alphaAcid')}
          />
        </label>
        <label>Weight ({user.units === 'metric' ? 'g' : 'oz'})<br />
          <input
            type="number"
            step="0.01"
            placeholder="0"
            min="0"
            value={formData.weight
              ? user.units === 'metric' ? parseFloat(oz2g(formData.weight).toFixed(5)) : formData.weight
              : ''}
            onChange={dataChanged('weight')}
          />
        </label>
        {(formData.use === 'boil' || formData.use === 'whirlpool') &&
          <label>Time (min)<br />
            <input
              type="number"
              step="1"
              placeholder="0"
              min="0"
              value={formData.lengthInBoil !== undefined && formData.lengthInBoil !== null
                ? formData.lengthInBoil
                : ''}
              onChange={dataChanged('lengthInBoil')}
            />
          </label>
        }
        {formData.use === 'first wort' &&
          <label>Multiplier %&nbsp;
            <Info
              alignment="top-right"
              info="First&nbsp;wort&nbsp;hopping&nbsp;generally adds about 10% to your ibu calculation using the total boil time. Setting the multiplier to 0 would be the same calculation as a hop addition for the full boil."
            /><br />
            <input
              type="number"
              step="1"
              placeholder="10"
              value={formData.multiplier !== undefined && formData.multiplier !== null
                ? formData.multiplier
                : ''}
              onChange={dataChanged('multiplier')}
            />
          </label>
        }
        {formData.use === 'dry hop' &&
          <label>Days<br />
            <input
              type="number"
              step="1"
              placeholder="0"
              value={formData.days !== undefined ? formData.days : ''}
              onChange={dataChanged('days')}
            />
          </label>
        }
        {formData.use === 'whirlpool' &&
          <label>Temp (°{user.units === "metric" ? "C" : "F"})&nbsp;
          <Info
            alignment="top-right"
            info="Temperature&nbsp;of&nbsp;the whirlpool when adding&nbsp;hop&nbsp;addition."
          />
          <br />
            <input
              type="number"
              step="1"
              placeholder="0"
              value={formData.whirlpoolTemp
                ? user.units === "metric"
                  ? parseFloat(f2c(formData.whirlpoolTemp).toFixed(2))
                  : formData.whirlpoolTemp
                : ''}
              onChange={dataChanged('whirlpoolTemp')}
            />
          </label>
        }
      </div>
      <p className={styles.extra}>
        {props.brew.ibu || (
          formData.use
          && (formData.lengthInBoil || formData.days)
          && formData.form
          && formData.alphaAcid
          && formData.weight
          && props.brew.og
        )
        ? <>Projected IBU: <strong>
            {!props.brew.boilLength && formData.use === 'first wort'
              ? 'set boil lengh to calculate'
              : props.brew.mash.length === 0 && formData.use === 'mash'
                ? 'add mash steps to calculate'
                : projectedTotalIBU}
          </strong><br /></>
          : null}
      </p>
    </>
  );
};

export default AddHopForm;
