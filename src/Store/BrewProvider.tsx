import React from 'react';
import axios from 'axios';

import { ls } from './UserProvider';
import * as Calculator from '../resources/javascript/Calculator';

async function saveBrew(brew: BrewInterface) {
  const currentUser = ls.load('currentUser');
  const authHeaders = {'authorization': currentUser ? currentUser.token : null};
  try {
    return await axios.post('http://localhost:4000/api/brews', {brew: brew}, {
      headers: authHeaders,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateBrewDB(brew: BrewInterface) {
  const currentUser = ls.load('currentUser');
  const authHeaders = {'authorization': currentUser ? currentUser.token : null};
  try {
    return await axios.put(`http://localhost:4000/api/brews/${brew.id}`, {brew: brew}, {
      headers: authHeaders,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getBrew(brewId: number) {
  const currentUser = ls.load('currentUser');
  const authHeaders = {'authorization': currentUser ? currentUser.token : null};
  try {
    return await axios.get(`http://localhost:4000/api/brews/${brewId}`, {
      headers: authHeaders,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteBrew(brewId: number) {
  const currentUser = ls.load('currentUser');
  const authHeaders = {'authorization': currentUser ? currentUser.token : null};
  try {
    return await axios.delete(`http://localhost:4000/api/brews/${brewId}`, {
      headers: authHeaders,
    });
  } catch (error) {
    console.log(error);
  }
}
export interface FermentableInterface {
  id?: number;
  name?: string;
  weight?: number;
  unit?: 'lbs' | 'oz';
  lovibond?: number;
  potential?: number;
  extract?: boolean;
  entryId?: number;
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
  totalMashVolume?: number;
  mashLength?: number;
  kettleSize?: number;
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

export const BrewContext = React.createContext(DEFAULT_STATE);

export default class BrewProvider extends React.Component {
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
    if (brew.batchType !== 'BIAB' && brew.totalFermentables && brew.waterToGrain) {
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

    this.setState({brew});
  };

  saveBrewToDB = (): Promise<any> => {
    return saveBrew(this.state.brew).then(res => {
      if (res.data) {
        const brew = {...res.data.brew};
        this.updateBrew(brew);
      }
    });
  };

  updateBrewOnDB = (): Promise<any> => {
    return updateBrewDB(this.state.brew).then();
  };

  getBrewfromDB = (id: number): Promise<any> => {
    return getBrew(id).then(res => {
      if (res.data) {
        const brew = {...res.data.brew};
        this.updateBrew(brew);
      }
    });
  };

  deleteBrewFromDB = (id: number): void => {
    deleteBrew(id).then(() => {
      this.clearBrew();
    });
  };

  clearBrew = (): void => {
    this.setState({brew: {
      name: '',
      fermentables: [],
      hops: [],
      yeast: [],
    }});
  };

  render() {
    return (
      <BrewContext.Provider
        value={{
          ...this.state,
          // @ts-ignore-line
          updateBrew: this.updateBrew,
          saveBrewToDB: this.saveBrewToDB,
          updateBrewOnDB: this.updateBrewOnDB,
          getBrewfromDB: this.getBrewfromDB,
          deleteBrewFromDB: this.deleteBrewFromDB,
          clearBrew: this.clearBrew,
        }}
      >
        {this.props.children}
      </BrewContext.Provider>
    );
  }
}