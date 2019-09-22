import React, { useState } from 'react';

const AlcoholContent = (props: any) => {
  // STATE
  const [og, setOg] = useState('');
  const [fg, setFg] = useState('');
  const [formula, setFormula] = useState('ABV');

  const { calculator } = props;
  let alc = null;

  const handleCheckboxChange = (e: any) => {
    const value = formula === 'ABV' ? 'ABW' : 'ABV';
    setFormula(value);
  }

  const ABVResults = () => {
    const result = calculator(og, fg, formula);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      alc = formula;
      return result + '%';
    } else {
        return '';
    }
  }

  return (
    <div>
      <h2>Alcohol Content</h2>
      <div>
        <label htmlFor="og">Original Gravity</label><br />
        <input
          name="og"
          type="number"
          value={og}
          onChange={(e) => setOg(e.target.value)}
        ></input><br />
        <label htmlFor="fg">Final Gravity</label><br />
        <input
          name="fg"
          type="number"
          value={fg}
          onChange={(e) => setFg(e.target.value)}
        ></input><br />
        <input
          type="checkbox"
          id="abvFormula"
          name="formula"
          value={formula}
          onChange={handleCheckboxChange}
          className="toggle"
        ></input>
        <label htmlFor="abvFormula">ABV<span className="toggle"></span>ABW</label><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{ABVResults()} <label>{alc}</label></p>
      </div>
    </div>
  );
}

export default AlcoholContent;
