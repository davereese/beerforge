import { ADJUNCT_TYPES } from "./constants";

export const getAdjunctById = (id?: number): string | undefined => {
  if (!id) {
    return undefined;
  }
  
  const adjunct = ADJUNCT_TYPES.find(type => id === type.value);
  return adjunct?.label;
};