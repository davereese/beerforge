import React from 'react';

import styles from '../Brew.module.scss';
import Card from '../../../components/Card/Card';
import List from '../../../components/List/List';
import ListItem from '../../../components/ListItem/ListItem';
import { BrewInterface, HopInterface } from '../../../Store/BrewContext';
import { oz2g } from '../../../resources/javascript/calculator';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewHops = (props: Props) => {
  const {brew, newBrew, readOnly, unitLabels, openSideBar, user} = props;
  return (
    <Card color="brew" customClass={`${newBrew? styles.newBrew: styles.view} ${styles.brew__editingSection}`}>
      <div className={styles.brew__header}>
        <h2>Hops</h2>
        {brew && brew.hops.length > 0
          ? <span>
              Total: {user.units === 'metric' ? parseFloat(oz2g(brew.totalHops).toFixed(2)) : brew.totalHops} {unitLabels.smallWeight}
            </span>
          : null}
        {!readOnly
          ? <button
              className={`button button--icon plus ${styles.editButton}`}
              onClick={openSideBar('hops')}
            ><span>Edit</span></button>
          : null}
      </div>
      <List customClass={`${styles.brew__ingredients} ${styles.hops}`}>
        {brew && brew.hops.map((hop: HopInterface, index: number) => (
          <ListItem
            color="brew"
            clicked={!readOnly ? openSideBar('hops', {...hop, index: index + 1}) : null}
            key={`${hop.id}${index}`}
          >
            <span className={styles.firstCol}>
              {user.units === 'metric' ? parseFloat(oz2g(hop.weight).toFixed(2)) : hop.weight} {unitLabels.smallWeight}
            </span>
            <span className={styles.secondCol}>{hop.name ? hop.name : hop.custom}</span>
            <span className={styles.thirdCol}>{hop.alphaAcid ? `${hop.alphaAcid}% AA` : null}</span>
            <span className={styles.fourthCol}>
              {hop.lengthInBoil
              && hop.use === 'boil' ? `${hop.lengthInBoil} min` : null}
              {hop.days ? `${hop.days} days` : null}
            </span>
            <span className={styles.fifthCol}>
              {hop.ibu && hop.ibu !== Infinity ? <>{hop.ibu} IBU</> : null}
            </span>
            <span className={styles.sixthCol}>
              {hop.use ? <div style={{textTransform: 'capitalize'}}>{hop.use}</div> : null}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default BrewHops;