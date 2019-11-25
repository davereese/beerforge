import React, { useState, useEffect } from 'react';

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
import MashInfusion from './Calculators/mash-infusion';
import { useUser } from '../../Store/UserContext';

const Calculators = (props: any) => {
  // CONTEXT
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();

  // STATE
  const [search, setSearch] = useState('');
  const [units, setUnits] = useState(user.units);

  const unitLabels = {
    vol: units === 'metric' ? 'L' : 'gal',
    smallVol: units === 'metric' ? 'L' : 'qts',
    largeWeight: units === 'metric' ? 'kg' : 'lb',
    smallWeight: units === 'metric' ? 'g' : 'oz',
    temp: units === 'metric' ? 'C' : 'F',
  }

  useEffect(() => {
    document.title = "BeerForge | Calculators";
    scrollToTop(0);
  }, []);

  const calculatorArray = [
    {
      calculator: <TotalWater calculator={Calculator.totalWater} units={units} labels={unitLabels} />,
      terms: ['water', 'total']
    },
    {
      calculator: <StrikeVolume calculator={Calculator.strikeVolume} units={units} labels={unitLabels} />,
      terms: ['water', 'strike', 'mash']
    },
    {
      calculator: <StrikeTemperature calculator={Calculator.strikeTemp} units={units} labels={unitLabels} />,
      terms: ['water', 'strike', 'mash']
    },
    {
      calculator: <MashInfusion calculator={Calculator.infusionWaterVol} units={units} labels={unitLabels} />,
      terms: ['water', 'mash', 'infusion']
    },
    {
      calculator: <SpargeVolume calculator={Calculator.spargeVolume} units={units} labels={unitLabels} />,
      terms: ['water', 'sparge']
    },
    {
      calculator: <EvaporationPercent calculator={Calculator.evaporationPercent} units={units} labels={unitLabels} />,
      terms: ['water', 'boil']
    },
    {
      calculator: <PreBoilVolume calculator={Calculator.preBoilVol} units={units} labels={unitLabels} />,
      terms: ['water', 'boil']
    },
    {
      calculator: <OriginalGravity calculator={Calculator.OG} units={units} labels={unitLabels} />,
      terms: ['gravity', 'original', 'og']
    },
    {
      calculator: <PreBoilGravity calculator={Calculator.preBoilG} units={units} labels={unitLabels} />,
      terms: ['gravity', 'pre boil', 'pre-boil']
    },
    {
      calculator: <YeastTargetPitchingRate calculator={Calculator.targetPitchingRate} units={units} labels={unitLabels} />,
      terms: ['yeast', 'pitching rate']
    },
    {
      calculator: <YeastPitchingRate calculator={Calculator.pitchingRate} units={units} labels={unitLabels} />,
      terms: ['yeast', 'pitching rate']
    },
    {
      calculator: <FinalGravity calculator={Calculator.FG} units={units} labels={unitLabels} />,
      terms: ['gravity', 'final', 'fg']
    },
    {
      calculator: <AlcoholContent calculator={Calculator.alcoholContent} units={units} labels={unitLabels} />,
      terms: ['alcohol', 'abv']
    },
    {
      calculator: <ApparentAttenuation calculator={Calculator.attenuation} units={units} labels={unitLabels} />,
      terms: ['attenuation', 'yeast']
    },
    {
      calculator: <IBU calculator={Calculator.IBU} units={units} labels={unitLabels} />,
      terms: ['ibu', 'ibus', 'hops']
    },
    {
      calculator: <SRM calculator={Calculator.SRM} units={units} labels={unitLabels} />,
      terms: ['srm', 'color', 'malt']
    },
    {
      calculator: <CO2 calculator={Calculator.CO2} units={units} labels={unitLabels} />,
      terms: ['co2', 'packaging', 'carbonation']
    },
  ];

  const filtered = calculatorArray.filter((item, i) => {
    let result;
    if (search !== '' && item.terms.find(term => term.includes(search))) {
      result = item;
    } else if (search === '') {
      result = item;
    }
    return result;
  });

  return (
    <section className={styles.calculators}>
      <div className={styles.topRow}>
        <h1 className={styles.calculators__header}>Calculators</h1>
        <div className={styles.controls}>
        <input
          type="checkbox"
          id="units"
          name="units"
          value={units === 'metric' ? 'us' : 'metric'}
          checked={units === 'metric'}
          onChange={(e) => setUnits(e.target.value)}
          className="toggle"
        ></input>
        <label htmlFor="units">US<span className="toggle"></span>Metric</label>
        <input
          type="text"
          name="search"
          className={styles.search}
          placeholder="Search"
          onChange={(e: any) => {setSearch(e.target.value)}}
        />
        </div>
      </div>
      <div className={styles.calculators__container}>
        {filtered.length > 0 
          ? filtered.map((item, i) => {
              if (search !== '' && item.terms.find(term => term.includes(search))) {
                return <Card customClass={styles.card} key={i}>
                    {item.calculator}
                  </Card>;
              } else if (search === '') {
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

export default Calculators;