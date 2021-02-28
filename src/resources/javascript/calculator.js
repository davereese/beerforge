// CONSTANTS
const shrinkage = 4; // 4%
const thermodynamicConstant = 0.2;

// PRIVATE FUNCTIONS

function convertToGravityUnits(value) {
  return parseFloat(((value / 1000) + 1).toFixed(3));
};

function convertToGravityPoints(gravity) {
  return (gravity - 1) * 1000;
}

function convertToPlato(SG) {
  // E = -668.962 + (1262.45 * SG) - (776.43 * SG^2) + (182.94 * SG^3)  - specific gravity to plato
  const E = -668.962 + (1262.45 * SG) - (776.43 * Math.pow(SG, 2)) + (182.94 * Math.pow(SG, 3));
  return E;
};

function calculateRealExtract(OE, AE) {
  // RE (real extract) = (0.8114 * AE) + (0.1886 * OE)
  const RE = (0.8114 * AE) + (0.1886 * OE);
  return RE;
};

function oz2kg(number) {
  return number * 0.0283495;
};

export function oz2g(number) {
  return number * 28.3495;
};

export function g2oz(number) {
  return number / 28.3495;
};

export function gal2l(number) {
  return number * 3.78541;
};

export function l2gal(number) {
  return number / 3.78541;
};

export function qt2l(number) {
  return number / 1.057;
};

export function l2qt(number) {
  return number * 1.057;
};

function gal2ml(number) {
  return number * 3785.41;
};

export function lb2kg(number) {
  return number * 0.453592;
};

export function kg2lb(number) {
  return number / 0.453592;
};

export function f2c(number) {
  return (number - 32) * 5/9;
};

export function c2f(number) {
  return (number * 9/5) + 32;
};

export function f2kelvin(number) {
  return (number - 32) * 5/9 + 273.15;
};

export function kelvin2f(number) {
  return (number - 273.15) * 9/5 + 32
};

export function c2kelvin(number) {
  return number + 273.15;
};

export function kelvin2c(number) {
  return number - 273.15;
};

function tanh(number) {
  return (Math.exp(number) - Math.exp(-number)) / (Math.exp(number) + Math.exp(-number));
};


// PUBLIC FUNCTIONS

// * Total fermentable weight
export function totalFermentableWeight(malts) {
  return parseFloat(malts.reduce((accumulator, currentValue) => (
    accumulator + +currentValue.weight
  ), 0).toFixed(2));
};

// * Total hop weight
export function totalHopWeight(hops) {
  let totalHops = 0;
  hops.forEach(hop => {
    totalHops += hop.weight ? hop.weight : 0;
  });
 return parseFloat(totalHops.toFixed(5));
};

// * Total Water
export function totalWater(batchSize, boilTime, boilOff, grainWeight, options) {
  // boilTime is in hours, hense (boilTime / 60)
  // totalWater = (((batchSize + trubLoss) / (1 - (shrinkage / 100))) / (1 - (boilTime * (boilOff / 100)))) + equipmentLoss + (grainWeight * absorptionRate)
  const {trubLoss, equipmentLoss, absorptionRate} = options;
  batchSize = parseFloat(batchSize);
  boilTime = parseFloat(boilTime);
  boilOff = parseFloat(boilOff);
  grainWeight = parseFloat(grainWeight);

  const totalWater = (((batchSize + trubLoss) / (1 - (shrinkage / 100))) / (1 - ((boilTime / 60) * (boilOff / 100)))) + equipmentLoss + (grainWeight * absorptionRate);
  return parseFloat(totalWater.toFixed(4));
};

// * BIAB Total Water
export function totalBIABWater(batchSize, boilTime, boilOff, grainWeight, hopWeight, options) {
  const {trubLoss, absorptionRate, hopAbsorptionRate} = options;
  batchSize = parseFloat(batchSize);
  boilTime = parseFloat(boilTime);
  boilOff = parseFloat(boilOff);
  grainWeight = parseFloat(grainWeight);
  hopWeight = parseFloat(hopWeight);

  const totalWater = (((batchSize + ((boilTime / 60) * boilOff)) + (absorptionRate * grainWeight)) + (hopAbsorptionRate * hopWeight)) + trubLoss;
  return parseFloat(totalWater.toFixed(2));
};

// * Strike Water Volume
export function strikeVolume(grainWeight, ratio = 1.5) {
  const sVol = (ratio * grainWeight) / 4;
  return parseFloat(sVol.toFixed(2));
};

// * Strike Water Temperature
export function strikeTemp(grainTemp, targetTemp, ratio, factor) {
  // R - ratio of water to grain, T1 - initial temp of grain, T2 - mash temp target
  // Strike Water Temperature Tw = (0.2 / R)(T2 - T1) + T2
  const useFactor = factor ? factor : 1; // the factor is for equipment temp losses
  const Tw = ((thermodynamicConstant / ratio) * (targetTemp - (grainTemp * useFactor)) + parseInt(targetTemp)).toFixed(2);
  return parseInt(Tw, 10); // round it
};

// * BIAB Strike Water Temperature
export function biabStrikeTemp(totalWater, grainWeight, targetTemp, grainTemp, units = 'us') {
  // (.2/((totalwater/grain)*4))*(mashTemp-grainTemp)+mashTemp
  const thermoConst = units !== 'us' ? 0.41 : thermodynamicConstant;
  const Tw = ((thermoConst / ((totalWater / grainWeight) * 4)) * (targetTemp - grainTemp) + parseInt(targetTemp)).toFixed(2);
  return parseInt(Tw, 10);
};

// Mash Infusion Equation:
export function infusionWaterVol(targetTemp, initailTemp, grainVol, totalMashVol, infusionWaterTemp) {
  // totalMashVol is in QUARTS
  // result is in QUARTS
  // Wa = (T2 - T1)(.2G + Wm)/(Tw - T2)
  const one = targetTemp - initailTemp;
  const two = (0.2 * grainVol) + Number(totalMashVol);
  const three = infusionWaterTemp - targetTemp;
  const result = one * two / three;
  return parseFloat(result.toFixed(2));
};

// * Sparge Water Volume
export function spargeVolume(totalWater, mashVolume) {
  return parseFloat((totalWater - mashVolume).toFixed(2));
}

// Boil-Off Evaporation Percentage
export function evaporationPercent(preBoil, postBoil, boilTime) {
  // [V(pb) - V(ab)] / time of boil

  preBoil = parseFloat(preBoil);
  postBoil = parseFloat(postBoil);
  const boilTimeCorrction = parseFloat(boilTime / 60);

  return parseFloat( ((preBoil - postBoil) / preBoil * 10) / boilTimeCorrction ).toFixed(2);
};

// * BIAB Total Mash Volume
export function totalMashVolume(totalWaterVol, grainWeight) {
  // Mash volume plus grains. Used to see if the batch will fit in the kettle.
  const grainSpace = 0.08; // grain takes up 0.08 gallons/pound or 0.667 L/kg
  return ((grainWeight * grainSpace) + totalWaterVol).toFixed(2);
};

// * Mash Efficiency %
export function mashEfficiency(malts, volume, gravity) {
  let extraction = 0;
  malts.forEach(malt => {
    extraction += malt.potential * malt.weight;
  });
  return (((volume * (gravity * 1000 - 1000)) / extraction) * 100).toFixed(0);
};

// * Pre-Boil Gravity
export function preBoilG(OG, grainVol, totalWaterVol, batchSize, equipmentLoss, absorptionRate, batchType = 'allGrain') {
  const PBVol = preBoilVol(totalWaterVol, grainVol, equipmentLoss, absorptionRate, batchType);
  // Pre-boil specific gravity points = (Post-boil volume * Post-boil gravity points) / Pre-boil volume
  const PreBoilG = (batchSize * convertToGravityPoints(OG)) / PBVol;

  // convert back to gravity units and return
  return convertToGravityUnits(PreBoilG);
};

// * Pre-Boil Volume
export function preBoilVol(totalWaterVol, grainVol, equipmentLoss, absorptionRate, batchType = 'allGrain') {
  // totalWaterVol - (grainVol * absorptionRate) - equipmentLoss
  const loss = batchType === 'BIAB' ? 0 : equipmentLoss;
  const result = totalWaterVol - (grainVol * absorptionRate) - loss;
  return parseFloat(result.toFixed(2));
};

// Partial Mash Top-off
export function partialMashTopOff(preBoilVolume, strikeVolume, grainVol, absorptionRate) {
  const result = preBoilVolume - (strikeVolume - (grainVol * absorptionRate));
  return parseFloat(result.toFixed(2));
};

// * Original Gravity
export function OG(malts, mashEfficiency, batchSize, fermentableUnits) {
  mashEfficiency = parseFloat(mashEfficiency);
  batchSize = parseFloat(batchSize);

  let totalPoints = 0,
      OG = null;

  for ( let i = 0; i < malts.length; i++ ) {
    const weight = fermentableUnits === 'percent' ? malts[i].calculatedWeight : malts[i].weight;
    totalPoints += malts[i].potential * weight;
  }

  // multiply by mash efficiency
  OG = totalPoints * (mashEfficiency/100) / batchSize;

  // convert back to gravity units and return
  return convertToGravityUnits(OG);
};

// * Target Yeast Pitching Rate
export function targetPitchingRate(OG, vol, targetRate) {
  // Target pitch rate: million cells / ml / degree plato
  const rate = (targetRate * 1000000) * gal2ml(vol) * convertToPlato(OG);
  return parseFloat((rate / 1000000000).toPrecision(3));
};

// * Yeast Pitching Rate
export function pitchingRate(type, cellCount, amount, dateBrewed, dateManufactured = null) {
  const date = dateBrewed ? Date.parse(dateBrewed) : Date.now();
  let viableCells;
  if (type === 'liquid') {
    const daysElapsed = Math.floor((date - Date.parse(dateManufactured)) / 86400000);
    const liquidCells = cellCount * amount * 1000000;
    viableCells = liquidCells - (liquidCells * ((daysElapsed * 0.7) / 100));
  } else if (type === 'dry') {
    viableCells = cellCount * amount * 1000000;
  }
  const result = (viableCells / 1000000).toPrecision(3);
  return result > cellCount * amount ? cellCount : parseFloat(result);
};

// * Final Gravity
export function FG(OG, attenuation) {
  // (Gravity points - (Gravity points * Attenuation rate%) + 1000) / 1000
  const gravity = convertToGravityPoints(OG);
  const aPercentage = attenuation/100;

  return parseFloat(((gravity - (gravity * aPercentage) + 1000) / 1000).toFixed(3));
};

// * Alcohol Content
export function alcoholContent(OG, FG, type = 'ABV') {
  // ABW = (OE - RE) / (2.0665 - (.010665 * OE) )      - alcohol by weight
  // ABV = (ABW * (FG / .794) )                        - alcohol by vol
  const OE = convertToPlato(OG);
  const AE = convertToPlato(FG);
  const RE = calculateRealExtract(OE, AE);
  const ABW = (OE - RE) / (2.0665 - (.010665 * OE) );
  const ABV = (ABW * (FG / .794) );

  const result = type === 'ABW' ? ABW.toFixed(2) : ABV.toFixed(2);

  return parseFloat(result);
};

// * Attenuation
export function attenuation(OG, FG) {
  // A = 100 * (OG – FG)/(OG – 1.0)
  const A = (100 * (OG - FG)/(OG - 1.0)).toFixed(1);
  return A;
};

// Utilization calculator for hte IBU Calculator
function getWhirlpoolUtilization(hop) {
  if (hop.use === 'whirlpool') {
    const T = f2kelvin(hop.whirlpoolTemp);
    const whirlpoolUtilization = 2.39 * Math.pow(10, 11) * Math.pow(2.71828, (-9773/T));
    return parseFloat(whirlpoolUtilization.toFixed(2) > 1 ? 1 : whirlpoolUtilization.toFixed(2));
  } else {
    return 1; // 100%
  }
};

// * IBU
export function IBU(hops, OG, vol, type = 'rager') {
  // TODO: sepatate the unit conversions out of this function

  let IBU = 0,
      multiplier = 1;

  for ( let i = 0; i < hops.length; i++ ) {
    if (hops[i].use === 'first wort') { multiplier = hops[i].multiplier * 0.01 + 1; }
    if (hops[i].use === 'mash') { multiplier = 0.125; }
    if (hops[i].lengthInBoil || hops[i].days) {
      const utilizationFactor = hops[i].form === 'pellet' ? 1.15 : 1.0;

      if (type === 'tinseth') {
        const utilization = (1.65 * Math.pow(0.000125, OG - 1.0) * ((1 - Math.pow(Math.E, -0.04 * hops[i].lengthInBoil)) / 4.15));
        const whirlpoolUtilization = getWhirlpoolUtilization(hops[i]);
        IBU += (utilization * whirlpoolUtilization) * ((hops[i].alphaAcid / 100.0 * oz2kg(hops[i].weight) * 1000000) / gal2l(vol) * utilizationFactor);
      } else if (type === 'rager') {
        const utilization = 18.11 + 13.86 * tanh((hops[i].lengthInBoil - 31.32) / 18.27);
        const whirlpoolUtilization = getWhirlpoolUtilization(hops[i]);
        const adjustment = Math.max(0, (OG - 1.050) / 0.2);
        // multiply by the multiplyer for first wort calculations
        IBU += (oz2kg(hops[i].weight) * 100 * (utilization * whirlpoolUtilization) * utilizationFactor * hops[i].alphaAcid / (gal2l(vol) * (1 + adjustment))) * multiplier;
      }
    }
  }

  return !isNaN(IBU) ? parseFloat(IBU.toFixed(2)) : undefined;
};

// * SRM
export function SRM(malts, vol, units = 'weight') {
  // MCU = (grain_color * grain_weight_lbs) / volume_gallons - Malt Color Units
  // SRM = 1.4922 * [MCU ^ 0.6859] - The more accurate Morey equation
  let MCU = 0,
      SRM;

  for ( let i = 0; i < malts.length; i++ ) {
    if (units === 'percent') {
      MCU += (malts[i].lovibond * malts[i].calculatedWeight) / vol;
    } else {
      MCU += (malts[i].lovibond * malts[i].weight) / vol;
    }
    MCU = Infinity === MCU ? 0 : MCU;
  }

  SRM = (1.4922 * Math.pow(MCU, 0.6859)).toFixed(2);

  return SRM > 0 ? parseFloat(SRM) : undefined;
};

// * CO2
export function CO2(temp, vol, type, beerVol) {
  let X,
      dissolvedCO2 = ((-0.9753) * Math.log(temp) + 4.9648);
      beerVol = null === beerVol ? 5 : '' === beerVol.toString() ? 5 : beerVol;

  switch (type) {
    case 'forced':
      // P = -16.6999 - 0.0101059*T + 0.00116512*T^2 + 0.173354*T*V + 4.24267*V - 0.0684226*V^2
      X = (-16.6999 - (0.0101059 * temp) + (0.00116512 * Math.pow(temp, 2)) + (0.173354 * temp * vol) + (4.24267 * vol) - (0.0684226 * Math.pow(vol, 2))).toFixed(2);
      break;
    case 'cornSugar':
      X = ((((Number(vol) - dissolvedCO2) * 4 * (beerVol * 3.8)) / 28.34952) * 1).toFixed(2);
      break;
    case 'caneSugar':
      X = ((((Number(vol) - dissolvedCO2) * 4 * (beerVol * 3.8)) / 28.34952) * 0.91).toFixed(2);
      break;
    case 'dme':
      X = ((((Number(vol) - dissolvedCO2) * 5.33 * (beerVol * 3.8) ) / 28.34952) * 0.91).toFixed(2);
      break;
    default:
      break;
  }

  return parseFloat(X);
};