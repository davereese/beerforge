import React, { useState } from 'react';

const ApparentAttenuation = (props: any) => {
  // STATE
  const [og, setOg] = useState('');
  const [fg, setFg] = useState('');

  const { calculator } = props;
  let atten = null;

  const attenuationResults = () => {
    const result = calculator(og, fg);
    if (!isNaN(result) && isFinite(result) && result > 0 && result <= 100) {
      atten = '%';
      return result;
    }
  }

  return (
    <div>
      <h2>Apparent Attenuation</h2>
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
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{attenuationResults()}<label>{atten}</label></p>
      </div>
    </div>
  );
}

export default ApparentAttenuation;
