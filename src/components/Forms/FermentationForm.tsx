import React, { useState, useEffect } from 'react';

// import styles from "./Forms.module.scss"
import { BrewInterface, FermentationInterface } from '../../Store/BrewContext';
import { useUser } from '../../Store/UserContext';
import { f2c, c2f } from '../../resources/javascript/calculator';

interface Props {
  brew: BrewInterface;
  editingData: FermentationInterface;
  dataUpdated: Function;
}

function FermentationForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState<FermentationInterface>({});

  const dataChanged = (type: string) => (event: any) => {
    let data: FermentationInterface = {};
    if (type === 'stageTemp') {
      data.stageTemp = user.units === 'metric' ? Number(c2f(event.currentTarget.value)) : Number(event.currentTarget.value);
    } else if (type === 'stageLength') {
      formData.stageLength = Number(event.currentTarget.value);
    } else {
      data.stageName = event.currentTarget.value;
    }
    setFormData({...formData, ...data});
  };

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    let dataToSet: FermentationInterface[] = [];
    const fermentationArray = props.brew.fermentation ? [...props.brew.fermentation] : [];
    const index = props.editingData && props.editingData.index ? Number(props.editingData.index) : -1;

    if (index > -1) {
      dataToSet = fermentationArray;
      dataToSet.splice(index-1, 1, formData);
    } else {
      dataToSet = [...fermentationArray, formData];
    }

    // this lastIndex stuff is a check to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const stageLength = dataToSet[lastIndex].stageLength;
    if (stageLength && stageLength > 0) {
      props.dataUpdated({...props.brew, fermentation: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // reset form when submitted
    setFormData({});
  }, [props.brew]);

  useEffect(() => {
    // if the form's editingData changes, we've selected something to edit.
    // set the form default valies to be the data we're editing.
    if (props.editingData !== null) {
      setFormData(props.editingData);
    } else {
      setFormData({});
    }
  }, [props.editingData]);

  return(
    <>
      <label>Stage Name<br />
        <input
          type="text"
          placeholder="Primary"
          value={formData.stageName ? formData.stageName : ''}
          onChange={dataChanged('stageName')}
        />
      </label>
      <label>Stage Length (days)<br />
        <input
          type="number"
          placeholder="14"
          value={formData.stageLength ? formData.stageLength : ''}
          onChange={dataChanged('stageLength')}
        />
      </label>
      <label>Stage Temp (°{user.units === 'metric' ? 'C' : 'F'})<br />
        <input
          type="number"
          placeholder={user.units === 'metric' ? '17' : '64'}
          value={formData.stageTemp ? user.units === 'metric'
              ? parseFloat(f2c(formData.stageTemp).toFixed(2))
              : formData.stageTemp
            : ''
          }
          onChange={dataChanged('stageTemp')}
        />
      </label>
    </>
  );
};

export default FermentationForm;