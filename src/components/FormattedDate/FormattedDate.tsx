import React from 'react';

interface Props {
  className?: any;
  children?: any;
}

export const getFormattedDate = (date: string | Date) => {
  const d = new Date(date);
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  const year = d.getFullYear();

  return (`${month}.${day}.${year}`);
}

function FormattedDate({
  className,
  children
}: Props) {
  return(
    <span className={className}>
      {getFormattedDate(children)}
    </span>
  );
};

export default FormattedDate;