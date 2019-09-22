import React, { useState } from 'react';

const YeastPitchingRate = (props: any) => {
  // STATE
  const [type, setType] = useState('liquid');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [cells, setCells] = useState('');

  const { calculator } = props;
  let label = '';

  const results = () => {
    const result = calculator(type, Number(cells), Number(number), date);
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'billion cells';
      return result;
    } else {
      label = '';
    }
  }

  return (
    <div>
      <h2>Total Yeast Cells</h2>
      <div>
        <label htmlFor="type">Yeast Type</label><br />
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="liquid">Liquid (pack/vial)</option>
          <option value="dry">Dry</option>
        </select><br />
        {type === 'liquid' &&
          <div>
            <label htmlFor="number">Number of Liquid Packs</label><br />
            <input
              name="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            ></input><br />
            <label htmlFor="cells">Cell Count</label><br />
            <input
              name="cells"
              type="number"
              value={cells}
              onChange={(e) => setCells(e.target.value)}
            ></input><br />
            <label htmlFor="date">Manufactured Date</label><br />
            <input
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            ></input><br />
          </div>
        }
        {type === 'dry' &&
          <div>
            <label htmlFor="number">Number of Dry Packs</label><br />
            <input
              name="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            ></input><br />
            <label htmlFor="cells">Cell Count</label><br />
            <input
              name="cells"
              type="number"
              value={cells}
              onChange={(e) => setCells(e.target.value)}
            ></input><br />
          </div>
        }
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default YeastPitchingRate;
