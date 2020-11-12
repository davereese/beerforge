export const getCategoryColor = (categoryNumber: number): string => {
  let color = '';
  switch (categoryNumber) {
    case 1:
      color = '#ffdb4a';
      break;
    case 2:
      color = '#d48d1c';
      break;
    case 3:
      color = '#fff7da';
      break;
    case 4:
      color = '#ff8900';
      break;
    case 5:
      color = '#894200';
      break;
    case 6:
      color = '#c4c4c4';
      break;
    default:
      color = ''
      break;
  }
  console.log(color);
  return color;
}