import React from 'react';
// import { Link } from 'react-router-dom';

import styles from './Calculators.module.scss';
import Card from '../../components/Card/Card';
import * as Calculator from '../../resources/javascript/calculator';
import TotalWater from './Calculators/total-water';
import StrikeVolume from './Calculators/strike-volume';
import StrikeTemperature from './Calculators/strike-temperature';
import SpargeVolume from './Calculators/sparge-volume';
import EvaporationPercent from './Calculators/evap-percent';
import PreBoilVolume from './Calculators/pre-boil-volume';
import OriginalGravity from './Calculators/og';
import PreBoilGravity from './Calculators/pre-boil-gravity';
import YeastTargetPitchingRate from './Calculators/yeast-target';
import YeastPitchingRate from './Calculators/yeast-rate';
import FinalGravity from './Calculators/fg';
import AlcoholContent from './Calculators/alcohol-content';
import ApparentAttenuation from './Calculators/apparent-attenuation';
import IBU from './Calculators/ibu';
import SRM from './Calculators/srm';
import CO2 from './Calculators/co2';

class Calculators extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    document.title = "BeerForge | Calculators";
  }

  render() {
    return (
      <section className={styles.calculators}>
        <div className={styles.topRow}>
          <h1 className={styles.calculators__header}>Calculators</h1>
        </div>
        <div className={styles.calculators__container}>
          <Card customClass={styles.card}>
            <TotalWater calculator={Calculator.totalWater} />
          </Card>
          <Card customClass={styles.card}>
            <StrikeVolume calculator={Calculator.strikeVolume} />
          </Card>
          <Card customClass={styles.card}>
            <StrikeTemperature calculator={Calculator.strikeTemp} />
          </Card>
          <Card customClass={styles.card}>
            <SpargeVolume calculator={Calculator.spargeVolume} />
          </Card>
          <Card customClass={styles.card}>
            <EvaporationPercent calculator={Calculator.evaporationPercent} />
          </Card>
          <Card customClass={styles.card}>
            <PreBoilVolume calculator={Calculator.preBoilVol} />
          </Card>
          <Card customClass={styles.card}>
            <OriginalGravity calculator={Calculator.OG} />
          </Card>
          <Card customClass={styles.card}>
            <PreBoilGravity calculator={Calculator.preBoilG} />
          </Card>
          <Card customClass={styles.card}>
            <YeastTargetPitchingRate calculator={Calculator.targetPitchingRate} />
          </Card>
          <Card customClass={styles.card}>
            <YeastPitchingRate calculator={Calculator.pitchingRate} />
          </Card>
          <Card customClass={styles.card}>
            <FinalGravity calculator={Calculator.FG} />
          </Card>
          <Card customClass={styles.card}>
            <AlcoholContent calculator={Calculator.alcoholContent} />
          </Card>
          <Card customClass={styles.card}>
            <ApparentAttenuation calculator={Calculator.attenuation} />
          </Card>
          <Card customClass={styles.card}>
            <IBU calculator={Calculator.IBU} />
          </Card>
          <Card customClass={styles.card}>
            <SRM calculator={Calculator.SRM} />
          </Card>
          <Card customClass={styles.card}>
            <CO2 calculator={Calculator.CO2} />
          </Card>
        </div>
      </section>
    );
  }
}

export default Calculators;