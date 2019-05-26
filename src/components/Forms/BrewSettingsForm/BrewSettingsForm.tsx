import React from 'react';

import styles from "../Forms.module.scss"

interface Props {}

function BrewSettingsForm({}: Props) {

  return(
    <>
      <label>Batch Type<br />
        <select>
          <option value="">Choose One</option>
          <option value="allGrain">All Grain</option>
          <option value="biab">BIAB</option>
          <option value="partialMash">Partial Mash</option>
          <option value="extract">Extract</option>
        </select>
      </label><br />
      <div className={styles.row}>
        <label>
          Batch Size (gal)<br />
          <input type="number" placeholder="6" />
        </label>
        <label>
          System Efficiency (%)<br />
          <input type="number" placeholder="75" />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Boil-off Factor<br />
          <input type="number" />
        </label>
      </div>
    </>
  );
};

export default BrewSettingsForm;