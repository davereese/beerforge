import React from 'react';

import styles from './BrewHistoryNav.module.scss';
import first from "../../../resources/images/history-first.svg";
import last from "../../../resources/images/history-last.svg";
import current from "../../../resources/images/history-current.svg";
import next from "../../../resources/images/history-next.svg";
import prev from "../../../resources/images/history-prev.svg";

interface Props {
  historyLength: number;
  currentPage: number;
  pageClicked: Function;
}

const BrewHistoryNav = (props: Props) => {
  const {historyLength, currentPage, pageClicked} = props;
  return (
    <div className={styles.historyNav}>
      {currentPage === 0 && <button
          className={`button button--link`}
          onClick={pageClicked(currentPage)}
          title="Current - Toggle brew history"
        ><img src={first} alt="First" /></button>}

      {currentPage > 0 && <button
          className={`button button--link`}
          onClick={pageClicked(currentPage-1)}
          title="Previous - View the previous brew"
        ><img src={prev} alt="Previous" /></button>}

      {currentPage > 0 && historyLength > currentPage+1 && <button
          className={`button button--link`}
          onClick={pageClicked(currentPage)}
          title="Current - Toggle brew history"
        ><img src={current} alt="Current" /></button>}

      {historyLength > currentPage+1 && <button
          className={`button button--link`}
          onClick={pageClicked(currentPage+1)}
          title="Next - View the next brew"
        ><img src={next} alt="Next" /></button>}

      {historyLength === currentPage+1 && <button
          className={`button button--link`}
          onClick={pageClicked(currentPage)}
          title="Current - Toggle brew history"
        ><img src={last} alt="Last" /></button>}
    </div>
  );
}

export default BrewHistoryNav;