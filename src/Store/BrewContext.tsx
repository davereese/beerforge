import React, { useReducer, useContext } from 'react';

// import * as brewService from './BrewService';
import * as Calculator from '../resources/javascript/calculator';

export interface FermentableInterface {
  id?: number;
  name?: string;
  custom?: string;
  weight?: number;
  unit?: 'lbs' | 'oz';
  lovibond?: number;
  potential?: number;
  extract?: boolean;
  entryId?: number;
  origin?: string;
  [key: string]: string | number | boolean | undefined;
};

export interface HopInterface {
  id?: number;
  name?: string;
  custom?: string;
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
  custom?: string;
  manufacturer?: string;
  amount?: number;
  type?: string;
  mfgDate?: Date;
  averageAttenuation?: number;
  cellCount?: number;
  viableCellCount?: number;
  [key: string]: string | number | Date | undefined;
};

export interface AdjunctInterface {
  id?: number;
  name?: string;
  custom?: string;
  amount?: number;
  units?: string;
  type?: string;
  use?: string;
  time?: number;
  [key: string]: string | number | undefined;
};

export interface BrewInterface {
  id?: number;
  userId?: number;
  name?: string;
  dateBrewed?: Date;
  batchType?: 'allGrain' | 'BIAB' | 'partialMash' | 'extract';
  batchSize?: number;
  systemEfficiency?: number;
  targetPitchingRate?: string;
  targetPitchingCellCount?: number;
  pitchCellCount?: number;
  fermentables: FermentableInterface[];
  totalFermentables?: number;
  totalGrainFermentables?: number;
  hops: HopInterface[];
  totalHops?: number;
  yeast: YeastInterface[];
  adjuncts: AdjunctInterface[];
  totalWater?: number;
  strikeTempFactor?: number;
  strikeTemp?: number;
  strikeVolume?: number;
  targetMashTemp?: number;
  waterToGrain?: number;
  grainTemp?: number;
  totalMashVolume?: number;
  mashLength?: number;
  kettleSize?: number;
  spargeTemp?: number;
  spargeVolume?: number;
  topOff?: number;
  boilLength?: number;
  preBoilVolume?: number;
  evaporationRate?: number;
  primaryLength?: number;
  primaryTemp?: number;
  secondaryLength?: number;
  secondaryTemp?: number;
  packagingType?: string;
  carbonationMethod?: string;
  CO2VolumeTarget?: number;
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

const initialState: any = {
  name: '',
  fermentables: [],
  hops: [],
  yeast: [],
  adjuncts: []
};

export const BrewContext = React.createContext(initialState);

const compareWeight = (a: FermentableInterface | HopInterface, b: FermentableInterface | HopInterface) => {
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

const compareAmount = (a: YeastInterface, b: YeastInterface) => {
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

const processBrew = (brew: BrewInterface): BrewInterface => {
  // Sort ingredients
  if (brew.fermentables) {
    brew.fermentables.sort(compareWeight);
  }
  if (brew.hops) {
    brew.hops.sort(compareWeight);
  }
  if (brew.yeast) {
    brew.yeast.sort(compareAmount);
  }
  if (brew.adjuncts) {
    brew.adjuncts.sort(compareAmount);
  }

  // Run Calculations
  if (brew.fermentables.length > 0) {
    brew.totalFermentables = Calculator.totalFermentableWeight(brew.fermentables);
    if (brew.batchType === 'partialMash') {
      const nonExtractFermentablesArray = brew.fermentables.filter(fermentable => fermentable.extract !== true);
      brew.totalGrainFermentables = Calculator.totalFermentableWeight(nonExtractFermentablesArray);
    }
  }
  if (brew.fermentables && brew.batchSize) {
    brew.srm = Calculator.SRM(brew.fermentables, brew.batchSize);
  }
  if (brew.batchType !== 'BIAB' && brew.totalFermentables && brew.waterToGrain) {
    if (brew.batchType === 'partialMash' && brew.totalGrainFermentables) {
      brew.strikeVolume = Calculator.strikeVolume(brew.totalGrainFermentables, brew.waterToGrain);
    } else {
      brew.strikeVolume = Calculator.strikeVolume(brew.totalFermentables, brew.waterToGrain);
    }
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
  if (brew.batchType !== 'BIAB' && brew.grainTemp && brew.targetMashTemp && brew.waterToGrain) {
    brew.strikeTemp = Calculator.strikeTemp(brew.grainTemp, brew.targetMashTemp, brew.waterToGrain, brew.strikeTempFactor);
  }
  if (brew.batchSize && brew.boilLength && brew.evaporationRate && brew.totalFermentables) {
    if (brew.batchType === 'BIAB') {
      brew.totalWater = Calculator.totalBIABWater(brew.batchSize, brew.boilLength, brew.evaporationRate, brew.totalFermentables, brew.totalHops);
    } else {
      brew.totalWater = Calculator.totalWater(brew.batchSize, brew.boilLength, brew.evaporationRate, brew.totalFermentables);
    }
  }
  if (brew.batchType === 'BIAB' && brew.totalWater && brew.totalFermentables && brew.grainTemp && brew.targetMashTemp) {
    brew.strikeTemp = Calculator.biabStrikeTemp(brew.totalWater, brew.totalFermentables, brew.targetMashTemp, brew.grainTemp, brew.strikeTempFactor);
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
      item.viableCellCount = Calculator.pitchingRate(item.type, item.cellCount, item.amount, item.mfgDate);
      totalCellCount += item.viableCellCount ? item.viableCellCount : 0;
    });
    brew.pitchCellCount = totalCellCount;
  }
  if (brew.totalWater && brew.totalFermentables) {
    brew.preBoilVolume = Calculator.preBoilVol(brew.totalWater, brew.totalFermentables, brew.batchType);
    if (brew.batchType === 'BIAB') {
      brew.totalMashVolume = Calculator.totalMashVolume(brew.totalWater, brew.totalFermentables);
    }
  }
  if (brew.batchType === 'partialMash' && brew.preBoilVolume && brew.spargeVolume && brew.totalGrainFermentables) {
    brew.topOff = Calculator.partialMashTopOff(brew.preBoilVolume, brew.spargeVolume, brew.totalGrainFermentables);
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
  if (brew.beerTemp && brew.CO2VolumeTarget && brew.carbonationMethod && brew.batchSize) {
    brew.amountForCO2 = Calculator.CO2(brew.beerTemp, brew.CO2VolumeTarget, brew.carbonationMethod, brew.batchSize);
  }

  return brew;
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'process':
      return processBrew(action.payload);
    case 'update':
      state = {
        ...state,
        ...action.payload
      };
      return processBrew(state);
    case 'clear':
      return initialState;
    default:
      throw new Error('Unexpected action');
  }
};

const BrewProvider = ({ children }: any) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <BrewContext.Provider value={contextValue}>
      {children}
    </BrewContext.Provider>
  );
};

const useBrew = () => {
  return useContext(BrewContext);
};

export default BrewProvider;
export { useBrew };