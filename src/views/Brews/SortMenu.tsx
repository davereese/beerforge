import React from 'react';

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
        <label>FILTER &amp; SORT</label>
          <ul>
            <li>
              <select
                className={`dark ${styles.filterInput}`}
                value={displaySort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDisplaySort(e.target.value)}
              >
                <option value="individual">All</option>
                <option value="series">Re-brew Series</option>
                <option value="noDrafts">Exclude Drafts</option>
                <option value="onlyDrafts">Only Drafts</option>
              </select>
              {/* <input
                type="radio"
                value="individual"
                id="individual"
                name="display"
                checked={displaySort === "individual"}
                onChange={(e: any) => setDisplaySort(e.target.value)}
              />
              <label htmlFor="individual">Individual</label>
            </li>
            <li>
              <input
                type="radio"
                value="series"
                id="series"
                name="display"
                checked={displaySort === "series"}
                onChange={(e: any) => setDisplaySort(e.target.value)}
              />
              <label htmlFor="series">Re-brew Series</label> */}
            </li>
          </ul>
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