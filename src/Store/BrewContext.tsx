import React, { useReducer, useContext } from 'react';

// import * as brewService from './BrewService';
import * as Calculator from '../resources/javascript/calculator';
import {
  compareWeight,
  compareTime,
  byUse,
  compareAmount,
  compareStep
} from './BrewContextUtils';

export interface FermentableInterface {
  id?: number;
  name?: string;
  custom?: string;
  weight?: number;
  calculatedWeight?: number; // if using percentage
  lovibond?: number;
  potential?: number;
  extract?: boolean;
  entryId?: number;
  origin?: string;
  index?: number;
  units?: 'lb' | 'kg' | 'percent';
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
  use?: 'boil' | 'dry hop' | 'mash' | 'first wort' | 'aroma';
  days?: number;
  multiplier?: number;
  index?: number;
  [key: string]: string | number | undefined;
};

export interface YeastInterface {
  id?: number;
  name?: string;
  custom?: string;
  manufacturer?: string;
  amount?: number;
  units?: string;
  type?: string;
  mfgDate?: Date;
  averageAttenuation?: number;
  cellCount?: number;
  viableCellCount?: number;
  index?: number;
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
  index?: number;
  [key: string]: string | number | undefined;
};

export interface MashInterface {
  type?: 'strike' | 'infusion' | 'decoction' | 'temperature' | 'sparge';
  strikeTemp?: number;
  strikeVolume?: number;
  targetStepTemp?: number;
  currentMashTemp?: number;
  waterToGrain?: number;
  grainTemp?: number;
  stepLength?: number;
  spargeTemp?: number;
  spargeVolume?: number;
  infusionWaterTemp?: number;
  infusionWaterVol?: number;
  [key: string]: string | number | undefined;
};

export interface FermentationInterface {
  stageName?: string;
  stageLength?: number;
  stageTemp?: number;
  notes?: string;
  [key: string]: string | number | undefined;
};

export interface processOptionsInterface {
  units: 'us' | 'metric';
  ibuFormula: 'rager' | 'tinseth';
  strikeFactor?: number;
  kettle?: number;
  evapRate?: number;
  trubLoss?: number;
  equipmentLoss?: number;
  absorptionRate?: number;
  hopAbsorptionRate?: number;
};

export interface BrewInterface {
  id?: number;
  userId?: number;
  name?: string;
  dateBrewed?: Date;
  batchType?: 'allGrain' | 'BIAB' | 'partialMash' | 'extract';
  batchSize?: number;
  mashEfficiency?: number;
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
  mash: MashInterface[];
  totalMashVolume?: number;
  topOff?: number;
  kettleSize?: number;
  boilLength?: number;
  preBoilVolume?: number;
  evaporationRate?: number;
  fermentation?: FermentationInterface[];
  packagingType?: string;
  carbonationMethod?: string;
  CO2VolumeTarget?: number;
  beerTemp?: number;
  amountForCO2?: number;
  notes?: string;
  tags?: string;
  srm?: number;
  ibu?: number;
  og?: number;
  preBoilG?: number;
  fg?: number;
  attenuation?: number;
  alcoholContent?: number;
  fermentableUnits?: 'weight' | 'percent';
  totalFermentablesPercent?: number;
  targetOG?: number;
};

const initialState: any = {
  name: '',
  fermentables: [],
  hops: [],
  yeast: [],
  adjuncts: [],
  mash: [],
  fermentation: [],
};

export const BrewContext = React.createContext(initialState);

export const processBrew = (
  brew: BrewInterface,
  options: processOptionsInterface
): BrewInterface => {

  // Sort ingredients
  if (brew.fermentables) {
    brew.fermentables.sort(compareWeight);
  }
  if (brew.hops) {
    brew.hops.sort(compareTime);
    brew.hops.sort(byUse);
  }
  if (brew.yeast) {
    brew.yeast.sort(compareAmount);
  }
  if (brew.adjuncts) {
    brew.adjuncts.sort(compareAmount);
  }

  // Sort mash steps
  if (brew.mash) {
    brew.mash.sort(compareStep);
  }

  // Run Calculations
  if (brew.fermentables.length > 0) {
    if (brew.fermentableUnits === 'percent' && brew.targetOG && brew.batchSize && brew.mashEfficiency) {
      // Calculate the actual weights
      const pointsNeeded = parseFloat((((Number(brew.targetOG) - 1) * 1000) * brew.batchSize).toPrecision(3));
      const weightNeeded = parseFloat((pointsNeeded / ((brew.mashEfficiency / 100) * 36)).toFixed(2));
      let totalWeight = 0;
      let totalPercent = 0;
      brew.fermentables.map(fermentable => {
        const fermentableWeight = fermentable.weight ? fermentable.weight : 0;
        const calculatedWeight = parseFloat((weightNeeded * (fermentableWeight / 100)).toFixed(2));
        totalWeight += calculatedWeight;
        totalPercent += fermentableWeight;
        return fermentable.calculatedWeight = calculatedWeight;
      });
      brew.totalFermentables = parseFloat(totalWeight.toFixed(2));
      brew.totalFermentablesPercent = totalPercent;
    } else {
      brew.totalFermentables = Calculator.totalFermentableWeight(
        brew.fermentables,
      );
      brew.totalFermentablesPercent = undefined;
    }
    if (brew.batchType === 'partialMash') {
      const nonExtractFermentablesArray = brew.fermentables.filter(
        fermentable => fermentable.extract !== true
      );
      brew.totalGrainFermentables = Calculator.totalFermentableWeight(
        nonExtractFermentablesArray
      );
    }
  }
  if (brew.fermentables && brew.batchSize) {
    brew.srm = Calculator.SRM(brew.fermentables, brew.batchSize, brew.fermentableUnits);
  }
  if (
    brew.batchType !== 'BIAB' &&
    brew.totalFermentables &&
    brew.mash.some(e => e.waterToGrain)
  ) {
    let index;
    const strike = brew.mash.find((step, i) => {
      if (step.type === 'strike') {
        index = i;
        return step;
      } else {
        return null;
      }
    });
    if (strike && index !== undefined) {
      if (brew.batchType === 'partialMash' && brew.totalGrainFermentables) {
        // convert BACK to kg so these numbers are accurate!!
        brew.mash[index].strikeVolume = Calculator.strikeVolume(
          options.units === 'metric' ? Calculator.lb2kg(brew.totalGrainFermentables) : brew.totalGrainFermentables,
          strike.waterToGrain
        );
      } else {
        // convert BACK to kg so these numbers are accurate!!
        brew.mash[index].strikeVolume = Calculator.strikeVolume(
          options.units === 'metric' ? Calculator.lb2kg(brew.totalFermentables) : brew.totalFermentables,
          strike.waterToGrain,
        );
      }
    }
  }
  if (brew.hops.length) {
    brew.totalHops = Calculator.totalHopWeight(brew.hops);
  }
  if (brew.hops.length > 0 && brew.og && brew.batchSize) {
    let totalIbu = 0;
    brew.hops = brew.hops.map(hop => {
      if (hop.use === 'first wort') {
        hop.lengthInBoil = brew.boilLength;
      } else if (hop.use === 'mash') {
        let mashLength = 0;
        brew.mash.forEach(step => {
          mashLength += step.stepLength ? Number(step.stepLength) : 0;
        });
        hop.lengthInBoil = mashLength;
      }
      hop.ibu = Calculator.IBU(
        [hop],
        brew.og,
        brew.batchSize,
        options.ibuFormula
      );
      totalIbu += hop.ibu ? hop.ibu : 0;
      return hop;
    });
    brew.ibu = parseFloat(totalIbu.toFixed(2));
  }
  if (
    brew.batchType !== 'BIAB' &&
    brew.mash.some(item =>
      item.grainTemp &&
      item.targetStepTemp &&
      item.waterToGrain
    )
  ) {
    let index;
    const step = brew.mash.find((item, i) => {
      if (
        item.grainTemp &&
        item.targetStepTemp &&
        item.waterToGrain
      ) {
        index = i;
        return item;
      } else {
        return null;
      }
    });
    if (step && index !== undefined) {
      brew.mash[index].strikeTemp = Calculator.strikeTemp(
        step.grainTemp,
        step.targetStepTemp,
        step.waterToGrain,
        options.strikeFactor
      );
    }
  }
  if (
    brew.batchSize &&
    brew.boilLength &&
    brew.evaporationRate &&
    brew.totalFermentables
  ) {
    if (brew.batchType === 'BIAB') {
      brew.totalWater = Calculator.totalBIABWater(
        brew.batchSize,
        brew.boilLength,
        brew.evaporationRate,
        brew.totalFermentables,
        brew.totalHops,
        options
      );
    } else {
      brew.totalWater = Calculator.totalWater(
        brew.batchSize,
        brew.boilLength,
        brew.evaporationRate,
        brew.totalFermentables,
        options
      );
    }
  }
  if (
    brew.batchType === 'BIAB' &&
    brew.totalWater &&
    brew.totalFermentables &&
    brew.mash.some(item =>
      item.grainTemp &&
      item.targetStepTemp
    )
  ) {
    let index;
    const step = brew.mash.find((item, i) => {
      if (
        item.grainTemp &&
        item.targetStepTemp
      ) {
        index = i;
        return item;
      } else {
        return null;
      }
    });
    if (step && index !== undefined) {
      brew.mash[index].strikeTemp = Calculator.biabStrikeTemp(
        brew.totalWater,
        brew.totalFermentables,
        step.targetStepTemp,
        step.grainTemp,
        options.units
      );
    }
  }
  if (
    brew.totalFermentables &&
    brew.mash.some(item =>
      item.type === 'infusion' &&
      item.targetStepTemp &&
      item.currentMashTemp &&
      item.infusionWaterTemp
    )
  ) {
    let waterVol = 0;
    brew.mash.forEach(step => {
      if (step.type === 'strike') {
        waterVol = step.strikeVolume
          ? waterVol + Number(step.strikeVolume * 4) // convert to quarts from gallons
          : waterVol + 0
      }
      if (step.type === 'infusion') {
        step.infusionWaterVol = Calculator.infusionWaterVol(
          step.targetStepTemp,
          step.currentMashTemp,
          brew.totalFermentables,
          waterVol,
          step.infusionWaterTemp
        );
        waterVol = step.infusionWaterVol
          ? waterVol + Number(step.infusionWaterVol)
          : waterVol + 0;
      }
      return step;
    });
  }
  if (
    brew.batchType === 'allGrain' &&
    brew.totalWater &&
    brew.mash.some(item => item.strikeVolume)
  ) {
    const step = brew.mash.find(item => item.type === 'strike');
    let index;
    let totalInfusionWaterVol = 0;
    brew.mash.find((item, i) => {
      if (item.type === 'sparge') {
        index = i;
      } else if (item.type === 'infusion') {
        totalInfusionWaterVol = item.infusionWaterVol
          ? totalInfusionWaterVol + Number(item.infusionWaterVol / 4) // convert to gallons from quarts
          : totalInfusionWaterVol + 0
      }
      return null;
    });
    // if water is added in an infusion, remove amount added from sparge water
    if (step && step.strikeVolume && index !== undefined) {
      brew.mash[index].spargeVolume = Calculator.spargeVolume(
        brew.totalWater,
        Number(step.strikeVolume) + totalInfusionWaterVol
      );
    }
  }
  if (brew.fermentables.length > 0 && brew.mashEfficiency && brew.batchSize) {
    brew.og = brew.targetOG ? brew.targetOG : Calculator.OG(
      brew.fermentables,
      brew.mashEfficiency,
      brew.batchSize
    );
  }
  if (brew.og && brew.totalFermentables && brew.totalWater && brew.batchSize) {
    brew.preBoilG = Calculator.preBoilG(
      brew.og,
      brew.totalFermentables,
      brew.totalWater,
      brew.batchSize,
      options.equipmentLoss,
      options.absorptionRate,
      brew.batchType
    );
  }
  if (brew.og && brew.batchSize && brew.targetPitchingRate) {
    brew.targetPitchingCellCount = Calculator.targetPitchingRate(
      brew.og,
      brew.batchSize,
      brew.targetPitchingRate
    );
  }
  if (brew.yeast.length > 0) {
    let totalCellCount = 0;
    brew.yeast.forEach(item => {
      if (item.units === 'cells') {
        item.viableCellCount = item.amount;
      } else {
        item.viableCellCount = Calculator.pitchingRate(
          item.type,
          item.cellCount,
          item.amount,
          brew.dateBrewed,
          item.mfgDate
        );
      }
      totalCellCount += item.viableCellCount ? item.viableCellCount : 0;
    });
    brew.pitchCellCount = totalCellCount;
  }
  if (brew.totalWater && brew.totalFermentables) {
    brew.preBoilVolume = Calculator.preBoilVol(
      brew.totalWater,
      brew.totalFermentables,
      options.equipmentLoss,
      options.absorptionRate,
      brew.batchType
    );
    if (brew.batchType === 'BIAB') {
      brew.totalMashVolume = Calculator.totalMashVolume(
        brew.totalWater,
        brew.totalFermentables
      );
    }
  }
  if (
    brew.batchType === 'partialMash' &&
    brew.preBoilVolume &&
    brew.mash.some(item => item.strikeVolume) &&
    brew.totalGrainFermentables
  ) {
    const step = brew.mash.find(item => item.strikeVolume);
    if (step) {
      // convert BACK to kg so these numbers are accurate!!
      brew.topOff = Calculator.partialMashTopOff(
        brew.preBoilVolume,
        step.strikeVolume,
        options.units === 'metric' ? Calculator.lb2kg(brew.totalGrainFermentables) : brew.totalGrainFermentables,
        options.absorptionRate
      );
    }
  }
  if (brew.yeast.length > 0 && brew.og) {
    let attenuationAdditions = 0;
    brew.yeast.forEach(
      item =>
        (attenuationAdditions += item.averageAttenuation
          ? item.averageAttenuation
          : 0)
    );
    brew.attenuation = attenuationAdditions / brew.yeast.length;
    brew.fg = Calculator.FG(brew.og, brew.attenuation);
  }
  if (brew.og && brew.fg) {
    brew.alcoholContent = Calculator.alcoholContent(brew.og, brew.fg, 'ABV');
  }
  if (
    brew.beerTemp &&
    brew.CO2VolumeTarget &&
    brew.carbonationMethod &&
    brew.batchSize
  ) {
    brew.amountForCO2 = Calculator.CO2(
      brew.beerTemp,
      brew.CO2VolumeTarget,
      brew.carbonationMethod,
      brew.batchSize
    );
  }

  return brew;
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'process':
      return processBrew(action.payload, action.options);
    case 'update':
      state = {
        ...state,
        ...action.payload
      };
      return processBrew(state, action.options);
    case 'clear':
      return initialState;
    default:
      throw new Error('Unexpected action');
  }
};

const BrewProvider = ({ children }: any) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <BrewContext.Provider value={contextValue}>{children}</BrewContext.Provider>
  );
};

const useBrew = () => {
  return useContext(BrewContext);
};

export default BrewProvider;
export { useBrew };
