import React, { useState, useEffect } from 'react';

import styles from '../Calculators.module.scss';
import { g2oz, l2gal } from '../../../resources/javascript/calculator';
import Select from '../../../components/Select/Select';

interface hop {
  aa: number | '';
  weight: number | '';
  length: number | '';
  type: 'leaf' | 'pellet';
};

const IBU = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [hops, setHops] = useState<hop[]>([{aa: '', weight: '', length: '', type: 'leaf'}]);
  const [og, setOg] = useState('');
  const [vol, setVol] = useState('');
  const [formula, setFormula] = useState('tinseth');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const addHop = (index: number, option: 'aa' | 'weight' | 'length' | 'type') => (e: any) => {
    const hopsArray = [...hops];
    // @ts-ignore-line
    hopsArray[index][option] = e.currentTarget.value;
    setHops(hopsArray);
  }

  const handleCheckboxChange = (e: any) => {
    const value = formula === 'tinseth' ? 'rager' : 'tinseth';
    setFormula(value);
  }

  const results = () => {
    const result = calculator(
      hops.map(hop => {
        return {
          alphaAcid: Number(hop.aa),
          weight: Number(hop.weight
            ? units === 'metric' ? parseFloat(g2oz(hop.weight).toFixed(4)) : hop.weight
            : undefined
          ),
          lengthInBoil: Number(hop.length),
          form: hop.type
        }
      }),
      Number(og),
      Number(vol ? units === 'metric' ? parseFloat(l2gal(vol).toFixed(4)) : vol : undefined),
      formula
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'IBU';
      return result;
    } else {
        return '';
    }
  }

  return (
    <div>
      <h2>IBU</h2>
      <div>
        <label>Hop</label>
        {hops && hops.map((hop, index: number) => (
          <div className={styles.rowQuad} key={`hop${index}`}>
            <div>
              <div className={styles.interiorRow}>
                <label htmlFor="aa">Alpha Acid
                <input
                  name="aa"
                  type="number"
                  value={hops[index].aa}
                  onChange={addHop(index, 'aa')}
                  autoComplete="none"
                ></input></label>
                <label htmlFor="weight">Weight ({props.labels.smallWeight})
                <input
                  name="weight"
                  type="number"
                  value={hops[index].weight}
                  onChange={addHop(index, 'weight')}
                ></input></label>
              </div>
              <div className={styles.interiorRow2}>
                <label htmlFor="length">Time (min)
                <input
                  name="length"
                  type="number"
                  value={hops[index].length}
                  onChange={addHop(index, 'length')}
                ></input></label>
                <label htmlFor="type">Type
                  <Select
                    options={[
                      {option: 'Pellet', value: 'pellet'},
                      {option: 'Whole Leaf', value: 'leaf'}
                    ]}
                    value={hops[index].type}
                    onChange={addHop(index, 'type')}
                    className="capitalize darkInput"
                  />
                </label>
              </div>
            </div>
            {index+1 === hops.length
              ? <button
                  className="button button--icon"
                  onClick={(e) => setHops([...hops, {aa: '', weight: '', length: '', type: 'leaf'}])}
                >+</button>
              : <button
                  className="button button--icon"
                  onClick={
                    (e) => {
                      const hopsArray = [...hops];
                      hopsArray.splice(index, 1);
                      setHops([...hopsArray]);
                    }
                  }
                >-</button>}
          </div>
        ))}
        <label htmlFor="og">Original Gravity</label><br />
        <input
          name="og"
          type="number"
          value={og}
          onChange={(e) => setOg(e.target.value)}
        ></input><br />
        <label htmlFor="vol">Final Volume ({props.labels.vol})</label><br />
        <input
          name="vol"
          type="number"
          value={vol}
          onChange={(e) => setVol(e.target.value)}
        ></input><br />
        <input
          type="checkbox"
          id="ibuFormula"
          name="formula"
          value={formula}
          onChange={handleCheckboxChange}
          className="toggle"
        ></input>
        <label htmlFor="ibuFormula">Tinseth<span className="toggle"></span>Rager</label><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default IBU;
