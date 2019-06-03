import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function AddFermentableForm(props: Props) {
  const [formData, setFormData] = useState(props.data);

  const dataChanged = (type: string) => (event: any) => {
    const data = event.currentTarget.value;
    setFormData({...formData, [type]: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <label>Batch Type<br />
        <select>
          <option value="0">Choose Malt</option>
        </select>
      </label><br />
      <label>Weight (lbs)<br />
        <input
          type="number"
          step="0.01"
          placeholder="0"
        />
      </label>
    </>
  );
};

export default AddFermentableForm;