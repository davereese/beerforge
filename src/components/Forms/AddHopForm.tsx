import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function AddHopForm(props: Props) {
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
      <label>Hop<br />
        <select>
          <option value="0">Choose Hop</option>
        </select>
      </label>
      <div className={styles.row}>
        <label>Alpha Acid<br />
          <input type="number" step="0.01" placeholder="0" />
        </label>
        <label>Length in Boil (min)<br />
          <input type="number" step="1"  placeholder="0" />
        </label>
      </div>
      <label>Weight (oz)<br />
        <input type="number" step="0.01" placeholder="0" />
      </label>
    </>
  );
};

export default AddHopForm;