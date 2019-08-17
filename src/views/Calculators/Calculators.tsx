import React from 'react';

import styles from './Calculators.module.scss';
import Card from '../../components/Card/Card';
import { scrollToTop } from '../../resources/javascript/scrollToTop';
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

const calculatorArray = [
  {calculator: <TotalWater calculator={Calculator.totalWater} />, terms: ['water', 'total']},
  {calculator: <StrikeVolume calculator={Calculator.strikeVolume} />, terms: ['water', 'strike']},
  {calculator: <StrikeTemperature calculator={Calculator.strikeTemp} />, terms: ['water', 'strike']},
  {calculator: <SpargeVolume calculator={Calculator.spargeVolume} />, terms: ['water', 'sparge']},
  {calculator: <EvaporationPercent calculator={Calculator.evaporationPercent} />, terms: ['water', 'boil']},
  {calculator: <PreBoilVolume calculator={Calculator.preBoilVol} />, terms: ['water', 'boil']},
  {calculator: <OriginalGravity calculator={Calculator.OG} />, terms: ['gravity', 'original', 'og']},
  {calculator: <PreBoilGravity calculator={Calculator.preBoilG} />, terms: ['gravity', 'pre boil', 'pre-boil']},
  {calculator: <YeastTargetPitchingRate calculator={Calculator.targetPitchingRate} />, terms: ['yeast', 'pitching rate']},
  {calculator: <YeastPitchingRate calculator={Calculator.pitchingRate} />, terms: ['yeast', 'pitching rate']},
  {calculator: <FinalGravity calculator={Calculator.FG} />, terms: ['gravity', 'final', 'fg']},
  {calculator: <AlcoholContent calculator={Calculator.alcoholContent} />, terms: ['alcohol', 'abv']},
  {calculator: <ApparentAttenuation calculator={Calculator.attenuation} />, terms: ['attenuation', 'yeast']},
  {calculator: <IBU calculator={Calculator.IBU} />, terms: ['ibu', 'ibus', 'hops']},
  {calculator: <SRM calculator={Calculator.SRM} />, terms: ['srm', 'color', 'malt']},
  {calculator: <CO2 calculator={Calculator.CO2} />, terms: ['co2', 'packaging', 'carbonation']},
];

class Calculators extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      search: '',
    }
  }

  componentDidMount() {
    document.title = "BeerForge | Calculators";
    scrollToTop(0);
  }

  render() {
    const filtered = calculatorArray.filter((item, i) => {
      let result;
      if (this.state.search !== '' && item.terms.find(term => term.includes(this.state.search))) {
        result = item;
      } else if (this.state.search === '') {
        result = item;
      }
      return result;
    });

    return (
      <section className={styles.calculators}>
        <div className={styles.topRow}>
          <h1 className={styles.calculators__header}>Calculators</h1>
          <input
            type="text"
            name="search"
            className={styles.search}
            placeholder="Search"
            onChange={(e: any) => {this.setState({search: e.target.value})}}
          />
        </div>
        <div className={styles.calculators__container}>
          {filtered.length > 0 
            ? filtered.map((item, i) => {
                if (this.state.search !== '' && item.terms.find(term => term.includes(this.state.search))) {
                  return <Card customClass={styles.card} key={i}>
                      {item.calculator}
                    </Card>;
                } else if (this.state.search === '') {
                  return <Card customClass={styles.card} key={i}>
                      {item.calculator}
                    </Card>;
                } else {
                  return null;
                }
              })
            : <p className={styles.noResults}>No results round.</p>}
        </div>
      </section>
    );
  }
}

export default Calculators;