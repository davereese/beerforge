import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function AddYeastForm(props: Props) {
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
      <label>Yeast<br />
        <select>
          <option value="0">Choose Yeast</option>
        </select>
      </label>
      <label>Packaging Type<br />
        <select>
          <option value="0">Choose One</option>
        </select>
      </label>
      <label>Amount<br />
        <input type="number" step="0.01" placeholder="0" />
      </label>
    </>
  );
};

export default AddYeastForm;