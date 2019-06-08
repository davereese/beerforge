import React from 'react';
import * as Calculator from '../resources/javascript/Calculator';

export interface FermentableInterface {
  id?: number;
  name?: string;
  weight?: number;
  unit?: 'lbs' | 'oz';
  lovibond?: number;
  potential?: number;
};

export interface HopInterface {
  id?: number;
  name?: string;
  weight?: number;
  alphaAcid?: number;
  lengthInBoil?: number;
  ibu?: number;
  unit?: 'g' | 'oz';
  form?: 'pellet' | 'leaf';
  [key: string]: string | number | undefined;
};

export interface YeastInterface {
  id?: number;
  name?: string;
  amount?: number;
  type?: string;
  mfgDate?: Date;
  averageAttenuation?: number;
  cellCount?: number;
  viableCellCount?: number;
};

export interface BrewInterface {
  name?: string;
  batchType?: 'allGrain' | 'BIAB' | 'partialMash' | 'extract';
  batchSize?: number;
  systemEfficiency?: number;
  targetPitchingRate?: string;
  targetPitchingCellCount?: number;
  pitchCellCount?: number;
  fermentables: FermentableInterface[];
  totalFermentables?: number;
  hops: HopInterface[];
  totalHops?: number;
  yeast: YeastInterface[];
  totalWater?: number;
  strikeTempFactor?: number;
  strikeTemp?: number;
  strikeVolume?: number;
  targetMashTemp?: number;
  waterToGrain?: number;
  grainTemp?: number;
  mashLength?: number;
  spargeTemp?: number;
  spargeVolume?: number;
  boilLength?: number;
  preBoilVolume?: number;
  evaporationRate?: number;
  primaryLength?: number;
  primaryTemp?: number;
  secondaryLength?: number;
  secondaryTemp?: number;
  packagingType?: string;
  carbonationMethod?: string;
  co2VolumeTarget?: number;
  beerTemp?: number;
  amountForCO2?: number;
  notes?: string;
  srm?: number;
  ibu?: number
  og?: number;
  preBoilG?: number;
  fg?: number;
  attenuation?: number;
  alcoholContent?: number;
};

const DEFAULT_STATE = {
  brew: {
    name: '',
    fermentables: [],
    hops: [],
    yeast: [],
  } as BrewInterface
};

export const ThemeContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  compareWeight = (a: FermentableInterface | HopInterface, b: FermentableInterface | HopInterface) => {
    const weightA = Number(a.weight);
    const weightB = Number(b.weight);
  
    let comparison = 0;
    if (weightA > weightB) {
      comparison = -1;
    } else if (weightA < weightB) {
      comparison = 1;
    }
    return comparison;
  };

  compareAmount = (a: YeastInterface, b: YeastInterface) => {
    const amountA = Number(a.amount);
    const amountB = Number(b.amount);
  
    let comparison = 0;
    if (amountA > amountB) {
      comparison = -1;
    } else if (amountA < amountB) {
      comparison = 1;
    }
    return comparison;
  };

  updateBrew = (brew: BrewInterface): void => {
    // Sort ingredients
    if (brew.fermentables) {
      brew.fermentables.sort(this.compareWeight);
    }
    if (brew.hops) {
      brew.hops.sort(this.compareWeight);
    }
    if (brew.yeast) {
      brew.yeast.sort(this.compareAmount);
    }

    // Run Calculations
    if (brew.fermentables.length > 0) {
      brew.totalFermentables = Calculator.totalFermentableWeight(brew.fermentables);
    }
    if (brew.fermentables && brew.batchSize) {
      brew.srm = Calculator.SRM(brew.fermentables, brew.batchSize);
    }
    if (brew.totalFermentables && brew.waterToGrain) {
      brew.strikeVolume = Calculator.strikeVolume(brew.totalFermentables, brew.waterToGrain);
    }
    if (brew.hops.length) {
      brew.totalHops = Calculator.totalHopWeight(brew.hops);
    }
    if (brew.hops.length > 0 && brew.og && brew.batchSize) {
      let totalIbu = 0;
      brew.hops = brew.hops.map(hop => {
        hop.ibu = Calculator.IBU([hop], brew.og, brew.batchSize, 'rager');
        totalIbu += hop.ibu ? hop.ibu : 0;
        return hop;
      });
      brew.ibu = parseFloat(totalIbu.toFixed(2));
    }
    if (brew.grainTemp && brew.targetMashTemp && brew.waterToGrain) {
      brew.strikeTemp = Calculator.strikeTemp(brew.grainTemp, brew.targetMashTemp, brew.waterToGrain, brew.strikeTempFactor);
    }
    if (brew.batchSize && brew.boilLength && brew.evaporationRate && brew.totalFermentables) {
      brew.totalWater = Calculator.totalWater(brew.batchSize, brew.boilLength, brew.evaporationRate, brew.totalFermentables);
    }
    if (brew.batchType === 'allGrain' && brew.totalWater && brew.strikeVolume) {
        brew.spargeVolume = Calculator.spargeVolume(brew.totalWater, brew.strikeVolume);
    }
    if (brew.batchType === 'partialMash' && brew.strikeVolume) {
      brew.spargeVolume = brew.strikeVolume;
    }
    if (brew.fermentables.length > 0 && brew.systemEfficiency && brew.batchSize) {
      brew.og = Calculator.OG(brew.fermentables, brew.systemEfficiency, brew.batchSize);
    }
    if (brew.og && brew.totalFermentables && brew.totalWater && brew.batchSize) {
      brew.preBoilG = Calculator.preBoilG(brew.og, brew.totalFermentables, brew.totalWater, brew.batchSize);
    }
    if (brew.og && brew.batchSize && brew.targetPitchingRate) {
      brew.targetPitchingCellCount = Calculator.targetPitchingRate(brew.og, brew.batchSize, brew.targetPitchingRate);
    }
    if (brew.yeast.length > 0) {
      let totalCellCount = 0;
      brew.yeast.forEach(item => {
        totalCellCount += item.viableCellCount ? item.viableCellCount : 0;
      });
      brew.pitchCellCount = totalCellCount;
    }
    if (brew.totalWater && brew.totalFermentables) {
      brew.preBoilVolume = Calculator.preBoilVol(brew.totalWater, brew.totalFermentables);
    }
    if (brew.yeast.length > 0 && brew.og) {
      let attenuationAdditions = 0;
      brew.yeast.forEach(item => attenuationAdditions += item.averageAttenuation ? item.averageAttenuation : 0);
      brew.attenuation = attenuationAdditions / brew.yeast.length;
      brew.fg = Calculator.FG(brew.og, brew.attenuation);
    }
    if (brew.og && brew.fg) {
      brew.alcoholContent = Calculator.alcoholContent(brew.og, brew.fg, 'ABV');
    }
    if (brew.beerTemp && brew.co2VolumeTarget && brew.carbonationMethod && brew.batchSize) {
      brew.amountForCO2 = Calculator.CO2(brew.beerTemp, brew.co2VolumeTarget, brew.carbonationMethod, brew.batchSize);
    }

    console.log(brew);
    this.setState({brew});
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          // @ts-ignore-line
          updateBrew: this.updateBrew,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}