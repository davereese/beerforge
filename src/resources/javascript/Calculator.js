// CONSTANTS
// TODO: make these customizable
const trubLoss = 0.5; // gal
const shrinkage = 4; // 4%
const equipmentLoss = 1; // gal
const absorptionRate = 0.15; // gal/lb of grain


// PRIVATE FUNCTIONS

function convertToGravityUnits(value) {
  return parseFloat(((value / 1000) + 1).toFixed(3));
}

function convertToGravityPoints(gravity) {
  return (gravity - 1) * 1000;
}

function convertToPlato(SG) {
  // E = -668.962 + (1262.45 * SG) - (776.43 * SG^2) + (182.94 * SG^3)  - specific gravity to plato
  const E = -668.962 + (1262.45 * SG) - (776.43 * Math.pow(SG, 2)) + (182.94 * Math.pow(SG, 3));
  return E;
}

function calculateRealExtract(OE, AE) {
  // RE (real extract) = (0.8114 * AE) + (0.1886 * OE)
  const RE = (0.8114 * AE) + (0.1886 * OE);
  return RE;
}

function oz2kg(number) {
  return number * 0.0283495;
}

function gal2l(number) {
  return number * 3.78541;
}

function gal2ml(number) {
  return number * 3785.41;
}

function tanh(number) {
  return (Math.exp(number) - Math.exp(-number)) / (Math.exp(number) + Math.exp(-number));
};


// PUBLIC FUNCTIONS

// * Total fermentable weight
export function totalFermentableWeight(malts) {
  let totalFermentableWeight = 0;
  malts.forEach(fermentable => {
    totalFermentableWeight = fermentable.weight
      ? Number(totalFermentableWeight) + Number(fermentable.weight)
      : 0;
  });
  return totalFermentableWeight;
};

// * Total Water
export function totalWater(batchSize, boilTime, boilOff, grainWeight) {
  // boilTime is in hours, hense (boilTime / 60)
  // totalWater = (((batchSize + trubLoss) / (1 - (shrinkage / 100))) / (1 - (boilTime * (boilOff / 100)))) + equipmentLoss + (grainWeight * absorptionRate)
  // TODO: convert all strings to numbers beforse saving to data model
  batchSize = parseFloat(batchSize);
  boilTime = parseFloat(boilTime);
  boilOff = parseFloat(boilOff);
  grainWeight = parseFloat(grainWeight);

  const totalWater = (((batchSize + trubLoss) / (1 - (shrinkage / 100))) / (1 - ((boilTime / 60) * (boilOff / 100)))) + equipmentLoss + (grainWeight * absorptionRate);
  return parseFloat(totalWater.toFixed(4));
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
  const useFactor = factor ? factor : 1;
  const Tw = ((0.2 / ratio) * (targetTemp - (grainTemp * useFactor)) + parseInt(targetTemp)).toFixed(2);
  return parseInt(Tw); // round it
};

// * Sparge Water Volume
export function spargeVolume(totalWater, mashVolume) {
  return parseFloat((totalWater - mashVolume).toFixed(2));
}

// Boil-Off Evaporation Percentage
export function evaporationPercent(postBoilV, preBoilV, minutes) {
  // 100 - (postBoil volume * 100 / preBoil volume)
  const result = (100 - (postBoilV * 100 / preBoilV)) / (minutes / 60);
  return result.toFixed(1);
};

// * Pre-Boil Gravity
export function preBoilG(OG, grainVol, totalWaterVol, vol) {
  const PBVol = preBoilVol(totalWaterVol, grainVol);
  // Pre-boil specific gravity points = (Post-boil volume * Post-boil gravity points) / Pre-boil volume
  const PreBoilG = (vol * convertToGravityPoints(OG)) / PBVol;

  // convert back to gravity units and return
  return convertToGravityUnits(PreBoilG);
};

// * Pre-Boil Volume
export function preBoilVol(totalWaterVol, grainVol) {
  // totalWaterVol - (grainVol * absorptionRate) - equipmentLoss
  const result = totalWaterVol - (grainVol * absorptionRate) - equipmentLoss;
  return parseFloat(result.toFixed(2));
};

// * Original Gravity
export function OG(malts, efficiency, volume) {
  efficiency = parseFloat(efficiency);
  volume = parseFloat(volume);

  let totalPoints = 0,
      OG = null;

  for ( let i = 0; i < malts.length; i++ ) {
    totalPoints += malts[i].potential * malts[i].weight;
  }

  // multiply by efficiency factor
  OG = totalPoints * (efficiency/100) / volume;

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
export function pitchingRate(type, cellCount, amount, date = null) {
  let viableCells;
  if (type === 'liquid') {
    const daysElapsed = Math.floor((Date.now() - Date.parse(date)) / 86400000);
    const liquidCells = cellCount * amount * 1000000;
    viableCells = liquidCells - (liquidCells * ((daysElapsed * 0.7) / 100));
  } else if (type === 'dry') {
    viableCells = cellCount * amount * 1000000;
  }
  const result = (viableCells / 1000000).toPrecision(3) < cellCount
    ? (viableCells / 1000000).toPrecision(3)
    : cellCount;
  return parseFloat(result);
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

// * IBU
export function IBU(hops, OG, vol, type = 'rager') {
  // TODO: sepatate the unit conversions out of this function

  let utilization,
      IBU = 0;

  for ( let i = 0; i < hops.length; i++ ) {
    const utilizationFactor = hops[i].type === 'pellet' ? 1.15 : 1.0;

    if (type === 'tinseth') {
      utilization = (1.65 * Math.pow(0.000125, OG - 1.0) * ((1 - Math.pow(Math.E, -0.04 * hops[i].length)) / 4.15));
      IBU += utilization * ((hops[i].aa / 100.0 * oz2kg(hops[i].weight) * 1000000) / gal2l(vol) * utilizationFactor);
    } else if (type === 'rager') {
      utilization = 18.11 + 13.86 * tanh((hops[i].length - 31.32) / 18.27);
      const adjustment = Math.max(0, (OG - 1.050) / 0.2);
      IBU += oz2kg(hops[i].weight) * 100 * utilization * utilizationFactor * hops[i].aa / (gal2l(vol) * (1 + adjustment));
    }
  }
  
  return IBU.toFixed(2);
};

// * SRM
export function SRM(malts, vol) {
  // MCU = (grain_color * grain_weight_lbs) / volume_gallons - Malt Color Units
  // SRM = 1.4922 * [MCU ^ 0.6859] - The more accurate Morey equation
  let MCU = 0,
      SRM;

  for ( let i = 0; i < malts.length; i++ ) {
    MCU += (malts[i].lovibond * malts[i].weight) / vol;
    MCU = Infinity === MCU ? 0 : MCU;
  }

  SRM = (1.4922 * Math.pow(MCU, 0.6859)).toFixed(2);

  return parseFloat(SRM);
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
      X = ((((vol - dissolvedCO2) * 4 * (beerVol * 3.8)) / 28.34952) * 1).toFixed(2);
      break;
    case 'caneSugar':
      X = ((((vol - dissolvedCO2) * 4 * (beerVol * 3.8)) / 28.34952) * 0.91).toFixed(2);
      break;
    case 'dme':
      X = ((((vol - dissolvedCO2) * 5.33 * (beerVol * 3.8) ) / 28.34952) * 0.91).toFixed(2);
      break;
    default:
      break;
  }

  return parseFloat(X);
};