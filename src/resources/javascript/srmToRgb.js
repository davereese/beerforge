export const getSrmToRgb = (srm) => {
  const r = Math.round(Math.min(255, Math.max(0, 255 * Math.pow(0.975, srm))));
  const g = Math.round(Math.min(255, Math.max(0, 245 * Math.pow(0.88, srm))));
  const b = Math.round(Math.min(255, Math.max(0, 220 * Math.pow(0.7, srm))));

  return `rgb(${ r }, ${ g }, ${ b }`;
}