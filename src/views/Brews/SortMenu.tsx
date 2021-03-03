import React from 'react';
import Select from '../../components/Select/Select';

import styles from './Brews.module.scss';

const SortMenu = (props: any) => {
  const {
    dateSort,
    setDateSort,
    displaySort,
    setDisplaySort,
    numToShow,
    setNumToShow,
  } = props;

  return (
    <div className={styles.sortMenu}>
      <div className={styles.sortMenu__column}>
        <label>DATE</label>
        <ul>
          <li>
            <input
              type="radio"
              value="desc"
              id="desc"
              name="date"
              checked={dateSort === "desc"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateSort(e.target.value)}
            />
            <label htmlFor="desc">Date descending</label>
          </li>
          <li>
            <input
              type="radio"
              value="asc"
              id="asc"
              name="date"
              checked={dateSort === "asc"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateSort(e.target.value)}
            />
            <label htmlFor="asc">Date ascending</label>
          </li>
        </ul>
      </div>
      <div className={styles.sortMenu__column}>
        <label>FILTER &amp; SORT<br />
          <ul>
            <li>
              <Select
                options={[
                  {option: 'All', value: 'individual'},
                  {option: 'Re-brew Series', value: 'series'},
                  {option: 'Exclude Drafts', value: 'noDrafts'},
                  {option: 'Only Drafts', value: 'onlyDrafts'},
                ]}
                value={displaySort}
                onChange={(e) => setDisplaySort(e.currentTarget.value)}
                className="capitalize darkInput select"
              />
              {/* <select
                className={`dark ${styles.filterInput}`}
                value={displaySort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDisplaySort(e.target.value)}
              >
                <option value="individual">All</option>
                <option value="series">Re-brew Series</option>
                <option value="noDrafts">Exclude Drafts</option>
                <option value="onlyDrafts">Only Drafts</option>
              </select> */}
            </li>
          </ul>
        </label>
      </div>
      <div className={styles.sortMenu__column}>
        <label>COUNT<br />
          <input
            type="number"
            step="10"
            className={`dark ${styles.countInput}`}
            value={numToShow.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumToShow(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

export default SortMenu;