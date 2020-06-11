import {
  FermentableInterface,
  HopInterface,
  YeastInterface,
  MashInterface
} from "./BrewContext";

export const compareWeight = (
  a: FermentableInterface | HopInterface,
  b: FermentableInterface | HopInterface
) => {
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

export const compareAmount = (a: YeastInterface, b: YeastInterface) => {
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

export const compareStep = (a: MashInterface, b: MashInterface) => {
  const typeA = a.type;
  const typeB = b.type;

  let comparison = 0;
  if (typeA === 'sparge' && typeB !== 'sparge') {
    comparison = 1;
  } else if (typeA !== 'sparge' && typeB === 'sparge') {
    comparison = -1;
  }
  if (typeA === 'strike' && typeB !== 'strike') {
    comparison = -1;
  }
  return comparison;
};

export const compareTime = (a: HopInterface, b: HopInterface) => {
  const lengthA = Number(a.lengthInBoil);
  const lengthB = Number(b.lengthInBoil);

  let comparison = 0;
  if (lengthA > lengthB) {
    comparison = -1;
  } else if (lengthA < lengthB) {
    comparison = 1;
  }
  return comparison;
}

export const byUse = (a: HopInterface, b: HopInterface) => {
  const usesOrderArray = ['mash', 'first wort', 'boil', 'aroma', 'whirlpool', 'dry hop'];
  const lengthA = usesOrderArray.indexOf(a.use ? a.use : '');
  const lengthB = usesOrderArray.indexOf(b.use ? b.use : '');

  let comparison = 0;
  if (lengthA > lengthB) {
    comparison = 1;
  } else if (lengthA < lengthB) {
    comparison = -1;
  }
  return comparison;
}