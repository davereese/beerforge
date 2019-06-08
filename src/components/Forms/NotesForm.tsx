import React, { useState, useEffect } from 'react';

import { BrewInterface } from '../../Store/BrewProvider';
import Textarea from '../Textarea/Textarea';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
}

function NotesForm(props: Props) {
  const [formData, setFormData] = useState(props.brew);

  const dataChanged = (data: string) => {
    setFormData({...formData, notes: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <Textarea
        data={props.brew.notes}
        valueUpdated={dataChanged}
      />
    </>
  );
};

export default NotesForm;