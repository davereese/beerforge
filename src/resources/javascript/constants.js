export const UNITS = [
  'g',
  'mg',
  'kg',
  'ml',
  'L',
  'pkg',
  'items',
  'drops',
  'tsp',
  'tbsp',
  'cup',
  'pt',
  'qt',
  'gal',
  'oz',
  'lb'
];

export const ADJUNCT_TYPES = [
  {label: 'flavor', value: 1},
  {label: 'spice', value: 2},
  {label: 'herb', value: 3},
  {label: 'fining', value: 4},
  {label: 'water agent', value: 5},
  {label: 'other', value: 6}
];

export const ADJUNCT_USE = [
  'mash',
  'boil',
  'primary',
  'secondary',
  'bottling'
];


export const HOP_USE = [
  'mash',
  'first wort',
  'boil',
  'aroma',
  'whirlpool',
  'dry hop',
];

export const PITCHING_RATES = [
  {value:"0.35", option:"0.35 (Mfr. rate for Ale)"},
  {value:"0.5", option:"0.5 (Mfr. rate for Ale)"},
  {value:"0.75", option:"0.75 (Ale)"},
  {value:"1.0", option:"1.0 (Ale)"},
  {value:"1.25", option:"1.25 (High OG Ale)"},
  {value:"1.5", option:"1.5 (Lager)"},
  {value:"1.75", option:"1.75 (Lager)"},
  {value:"2.0", option:"2.0 (High OG Lager)"},
];

export const INGREDIENTS_GRAPH_COLORS = {
  finishing: '#92f132',
  bittering: '#3ae492',
  dualPurpose: '#16a05e',
  base: '#ffdb4a',
  caramelCrystal: '#d48d1c',
  adjunctGrains: '#ffefb3',
  kilnedToasted: '#cf6f00',
  roasted: '#894200',
  sugars: '#c4c4c4',
};