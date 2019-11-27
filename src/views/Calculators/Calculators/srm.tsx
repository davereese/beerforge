import React, { useState, useEffect } from 'react';

import styles from '../Calculators.module.scss';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';
import { kg2lb, l2gal } from '../../../resources/javascript/calculator';

interface malt {
  lovibond: number | '';
  weight: number | '';
};

const SRM = (props:any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [malts, setMalts] = useState<malt[]>([{lovibond: '', weight: ''}]);
  const [volume, setVolume] = useState('');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const addMalt = (index: number, type: 'lovibond' | 'weight') => (e: any) => {
    const maltsArray = [...malts];
    maltsArray[index][type] = e.target.value;
    setMalts(maltsArray);
  }

  const results = () => {
    const result = calculator(
      malts ? units === 'metric' ? malts.map(malt => {
        parseFloat(kg2lb(malt.weight).toFixed(4));
        return malt;
      }) : malts : malts,
      volume ? units === 'metric' ? parseFloat(l2gal(volume).toFixed(4)) : volume : undefined
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'SRM';
      const style = {
        display: 'inline-block',
        marginRight: '4px',
        marginTop: '4px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        border: '1px solid #ffdb4a',
        backgroundColor: getSrmToRgb(result)
      };
      return <>
        <span style={style} />
        {result}
      </>;
    } else {
        return '';
    }
  }

  return (
    <div>
      <h2>Beer Color</h2>
      <div>
        <label>Malt</label>
        {malts && malts.map((malt, index: number) => (
          <div className={styles.row} key={`malt${index}`}>
            <label htmlFor="lovibond">Color (°L)
              <input
                name="lovibond"
                type="number"
                value={malts[index].lovibond}
                onChange={addMalt(index, 'lovibond')}
              ></input></label>
            <label htmlFor="weight">Weight ({props.labels.largeWeight})
              <input
                name="weight"
                type="number"
                value={malts[index].weight}
                onChange={addMalt(index, 'weight')}
              ></input></label>
            {index+1 === malts.length
              ? <button
                  className="button button--icon"
                  onClick={(e) => setMalts([...malts, {lovibond: '', weight: ''}])}
                >+</button>
              : <button
                  className="button button--icon"
                  onClick={
                    (e) => {
                      const maltsArray = [...malts];
                      maltsArray.splice(index, 1);
                      setMalts([...maltsArray]);
                    }
                  }
                >-</button>}
          </div>
        ))}
        <label htmlFor="volume">Final Volume ({props.labels.vol})</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default SRM;
