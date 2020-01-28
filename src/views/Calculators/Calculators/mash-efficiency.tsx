import React, { useState, useEffect } from 'react';

import styles from '../Calculators.module.scss';
import { l2gal, kg2lb } from '../../../resources/javascript/calculator';

interface malt {
  potential: number | '';
  weight: number | '';
};

const MashEfficiency = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [malts, setMalts] = useState<malt[]>([{potential: '', weight: ''}]);
  const [volume, setVolume] = useState('');
  const [gravity, setGravity] = useState('');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const addMalt = (index: number, type: 'potential' | 'weight') => (e: any) => {
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
      volume ? units === 'metric' ? parseFloat(l2gal(volume).toFixed(4)) : volume : undefined,
      gravity
    );
    if (volume && gravity && !isNaN(result) && isFinite(result)) {
      label = '%';
      return result;
    }
  }

  return (
    <div>
      <h2>Mash Efficiency</h2>
      <div>
        <label>Malt</label>
        {malts && malts.map((malt, index: number) => (
          <div className={styles.row} key={`malt${index}`}>
            <label htmlFor="potential">Potential (ex. 34)
              <input
                name="potential"
                type="number"
                value={malts[index].potential}
                onChange={addMalt(index, 'potential')}
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
                  onClick={(e) => setMalts([...malts, {potential: '', weight: ''}])}
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
        <label htmlFor="volume">Collected Wort Volume ({props.labels.vol})</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
        <label htmlFor="gravity">Collected Wort Gravity (ex. 1.056)</label><br />
        <input
          name="gravity"
          type="number"
          value={gravity}
          onChange={(e) => setGravity(e.target.value)}
        ></input><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()}<label>{label}</label></p>
      </div>
    </div>
  );
}

export default MashEfficiency;
