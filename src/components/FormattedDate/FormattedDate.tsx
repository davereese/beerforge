import React from 'react';

interface Props {
  children?: any;
}

export const getFormattedDate = (date: string | Date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();

  return (`${month}.${day}.${year}`);
}

function FormattedDate({
  children
}: Props) {
  return(
    <>
      {getFormattedDate(children)}
    </>
  );
};

export default FormattedDate;