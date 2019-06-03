import React from 'react';
import * as Calculator from '../resources/javascript/Calculator';

export interface FermentableInterface {
  name: string;
  weight: number;
  srm: number;
};

export interface HopInterface {
  name: string;
  weight: number;
  alphaAcid: number;
  lengthInBoil: number;
};

export interface YeastInterface {
  name: string;
  yeastForm: string;
  amount: number;
  mfgDate?: Date;
};

export interface BrewInterface {
  name?: string;
  batchType?: string;
  batchSize?: number;
  systemEfficiency?: number;
  targetPitchingRate?: string;
  fermentables?: FermentableInterface[];
  hops?: HopInterface[];
  yeast?: YeastInterface[];
  strikeTempFactor?: number;
  strikeTemp?: number;
  targetMashTemp?: number;
  waterToGrain?: number;
  grainTemp?: number;
  mashLength?: number;
  spargeTemp?: number;
  boilLength?: number;
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
};

const DEFAULT_STATE = {
  brew: {
    name: '',
  } as BrewInterface
};

export const ThemeContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  updateBrew = (brew: BrewInterface): void => {
    // Run Calculations
    if (brew.grainTemp, brew.targetMashTemp, brew.waterToGrain) {
      brew.strikeTemp = Calculator.strikeTemp(brew.grainTemp, brew.targetMashTemp, brew.waterToGrain, brew.strikeTempFactor);
    }
    if (brew.beerTemp, brew.co2VolumeTarget, brew.carbonationMethod, brew.batchSize) {
      brew.amountForCO2 = Calculator.CO2(brew.beerTemp, brew.co2VolumeTarget, brew.carbonationMethod, brew.batchSize);
    }

    this.setState({brew});
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          updateBrew: this.updateBrew,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}