import React, { useState, useEffect } from 'react';
import { g2oz, l2gal } from '../../../resources/javascript/calculator';

const IBU = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [aa, setAa] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [type, setType] = useState('leaf');
  const [og, setOg] = useState('');
  const [vol, setVol] = useState('');
  const [formula, setFormula] = useState('tinseth');

  const { calculator } = props;
  let label = null;

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const handleCheckboxChange = (e: any) => {
    const value = formula === 'tinseth' ? 'rager' : 'tinseth';
    setFormula(value);
  }

  const results = () => {
    const result = calculator(
      [{
        alphaAcid: Number(aa),
        weight: Number(weight ? units === 'metric' ? parseFloat(g2oz(weight).toFixed(4)) : weight : undefined),
        lengthInBoil: Number(length),
        form: type
      }],
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
        <label htmlFor="aa">Hop Alpha Acid</label><br />
        <input
          name="aa"
          type="number"
          value={aa}
          onChange={(e) => setAa(e.target.value)}
          autoComplete="none"
        ></input><br />
        <label htmlFor="weight">Hop Weight ({props.labels.smallWeight})</label><br />
        <input
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></input><br />
        <label htmlFor="length">Hop Time In Boil</label><br />
        <input
          name="length"
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        ></input><br />
        <label htmlFor="type">Hop Type</label><br />
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="leaf">Whole Leaf</option>
          <option value="pellet">Pellet</option>
        </select><br />
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
