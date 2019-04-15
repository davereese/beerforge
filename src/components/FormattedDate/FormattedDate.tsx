import React from 'react';

interface Props {
  children?: any;
}

function FormattedDate({
  children
}: Props) {
  const d = new Date(children);
  const month = d.getMonth() + 1;
  const day = d.getDay();
  const year = d.getFullYear();
  return(
    <>
      {month < 10 ? '0' + month : month}.
      {day < 10 ? '0' + day : day}.
      {year}
    </>
  );
};

export default FormattedDate;