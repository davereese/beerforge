import React from 'react';

import styles from '../Brew.module.scss';
import listStyles from './BrewHistoryList.module.scss';
import { BrewInterface } from '../../../store/BrewContext';
import Card from '../../../components/Card/Card';
import { parseStringValues } from '../BrewUtils';
import { getSrmToRgb } from '../../../resources/javascript/srmToRgb';
import { gal2l } from '../../../resources/javascript/calculator';
import FormattedDate from '../../../components/FormattedDate/FormattedDate';

interface Props {
  brew: BrewInterface;
  unitLabels?: any;
  user: any;
  itemClicked: Function;
}

const BrewHistoryList = (props: Props) => {
  const {brew, unitLabels, user, itemClicked} = props;

  return (
    <>
      {brew.history &&
        brew.history.map((historyItem, index) => {
          return (
            <Card
              color="brew"
              customClass={historyItem.id === brew.id ? listStyles.current : listStyles.notCurrent}
              key={historyItem.id}
            >
              <div className={styles.brew__numbers} onClick={itemClicked(index)}>
                <div className={`${styles.brew__numbersMenu} ${listStyles.evenMargin}`}>
                  <ul className={styles.brew__numbersList}>
                    <li>
                      Date Brewed: <strong><FormattedDate>{historyItem.dateBrewed}</FormattedDate></strong>
                    </li>
                    <li>
                      Brew Method: <strong>{parseStringValues(historyItem.batchType)}</strong>
                    </li>
                    <li>
                      Batch Size: <strong>{historyItem.batchSize
                        ? `${user.units === 'metric'
                          ? parseFloat(gal2l(historyItem.batchSize).toFixed(2))
                          : historyItem.batchSize} ${unitLabels.vol}`
                        : null}</strong>
                    </li>
                    <li>
                      Mash Efficiency: <strong>{historyItem.mashEfficiency ? `${historyItem.mashEfficiency}%` : null}</strong>
                    </li>
                  </ul>
                </div>
                <div className={styles.brew__stats}>
                  <div className={styles.brew__stat}>
                    <div>
                      <span className={styles.value}>{historyItem.alcoholContent ? `${historyItem.alcoholContent}%` : null}</span>
                      <label className={styles.label}>ABV</label>
                    </div>
                  </div>
                  <div className={styles.brew__stat}>
                    <div>
                      <span className={styles.value}>{historyItem.og ? `${historyItem.og}` : null}</span>
                      <label className={styles.label}>OG</label>
                    </div>
                  </div>
                  <div className={styles.brew__stat}>
                    <div>
                      <span className={styles.value}>{historyItem.ibu}</span>
                      <label className={styles.label}>IBU</label>
                    </div>
                  </div>
                  <div className={styles.brew__stat}>
                    <div>
                      <span className={styles.value}>
                        {brew.srm
                          ? <>
                              <div
                                className={styles.srmSwatch}
                                style={{backgroundColor: getSrmToRgb(historyItem.srm)}}
                              />
                              {historyItem.srm}
                            </>
                          : null }
                      </span>
                      <label className={styles.label}>SRM</label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })
      }
    </>
  );
}

export default BrewHistoryList;