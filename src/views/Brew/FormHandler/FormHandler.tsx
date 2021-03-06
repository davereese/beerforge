import React, { ReactElement, useState, useEffect } from 'react';

import styles from './FormHandler.module.scss';
import BrewSettingsForm from '../../../components/Forms/BrewSettingsForm';
import AddFermentableForm from '../../../components/Forms/AddFermentableForm';
import AddHopForm from '../../../components/Forms/AddHopForm';
import AddYeastForm from '../../../components/Forms/AddYeastForm';
import AddAdjunctForm from '../../../components/Forms/AddAdjunctForm';
import MashForm from '../../../components/Forms/MashForm';
import BoilForm from '../../../components/Forms/BoilForm';
import FermentationForm from '../../../components/Forms/FermentationForm';
import PackagingForm from '../../../components/Forms/PackagingForm';
import NotesForm from '../../../components/Forms/NotesForm';
import TagsForm from '../../../components/Forms/TagsForm';
import { BrewInterface } from '../../../store/BrewContext';
import { useBrew } from '../../../store/BrewContext';
import { useModal } from '../../../store/ModalContext';

interface Props {
  form: string;
  nextForm: any;
  editingData: any;
  closeSidebar: any;
  deleteBrew: Function;
  updateBrew: Function;
  open: boolean;
  brewdayResults: boolean;
}

function FormHandler({
  form,
  nextForm,
  editingData,
  closeSidebar,
  updateBrew,
  deleteBrew,
  open,
  brewdayResults
}: Props) {

  let title: string,
      component: ReactElement | null,
      submitText: string;
  
  // CONTEXT
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();
  const [brew] = useBrew();

  // STATE
  const [formData, setFormData] = useState<BrewInterface | null>(null);

  // Stuff that isn't supposed to be part of the brew
  const [optionData, setOptionData] = useState<any | null>({});

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (optionData && optionData.tagDeleted) { saveData() }
    if (optionData && optionData.units === 'percent' && formData !== null) {
      formData.fermentableUnits = optionData.units;
      formData.targetOG = optionData.targetOG;
    } else if (optionData && optionData.units !== 'percent' && formData !== null) {
      formData.fermentableUnits = 'weight';
      formData.targetOG = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionData]);

  const setData = (data: any, options: any = null) => {
    setFormData(data);
    setOptionData(options);
  };

  const handleKeyDown = (e: any) => {
    // submit and go to the next form on 'enter' press
    if (
      open &&
      e.target.id !== 'editOG' &&
      !e.target.className.includes('Select_selectContainer') &&
      !e.target.className.includes('Select_selectSearch') &&
      e.code === 'Enter'
    ) {
      handleNext();
    }
  };

  const saveData = () => {
    // look for duplicate hops and present offer to edit all
    let dupeHops: any[] = [];
    let editingIndex: number = 0;
    if (editingData) {
      editingIndex = editingData.index - 1;
      // dupeHops will never contain the just edited data
      dupeHops = formData && editingData && formData.hops.filter((hop, index) =>
        hop.name === editingData.name &&
        hop.alphaAcid === editingData.alphaAcid &&
        index !== editingIndex
      );
    }

    if (
      dupeHops.length &&
      formData &&
      editingData.alphaAcid !== formData.hops[editingIndex].alphaAcid
    ) {
      openModal(`Edit the alpha acid on all similar ${dupeHops[0].name} additions?`, 'Yes', 'No', () => {
        const editSimilarHops = formData.hops.map(hop => {
          if (hop.alphaAcid === editingData.alphaAcid) {
            hop.alphaAcid = formData.hops[editingIndex].alphaAcid;
          }
          return hop;
        })
        updateBrew({...formData, hops: editSimilarHops});
        modalDispatch({type: 'hide'});
      }, () => {
        updateBrew({...formData});
        modalDispatch({type: 'hide'});
      });
    } else if (
      optionData && optionData.units === 'percent' &&
      brew.fermentableUnits !== 'percent'
    ) {
      // display message that we made a global change
      openModal('You have changed this brew\'s grain bill to percentages. This is a global change and will affect all fermentables. You won\'t need to set this again.', 'Got It', 'Go Back', () => {
        updateBrew({...formData});
        modalDispatch({type: 'hide'});
      }, () => {
        modalDispatch({type: 'hide'});
      });
    } else if (
      optionData && optionData.units !== 'percent' &&
      brew.fermentableUnits === 'percent'
    ) {
      // display message that we made a global change
      openModal('You have changed this brew\'s grain bill to weights. This is a global change and will affect all fermentables. You won\'t need to set this again.', 'Got It', 'Go Back', () => {
        updateBrew({...formData});
        modalDispatch({type: 'hide'});
      }, () => {
        modalDispatch({type: 'hide'});
      });
    } else {
      updateBrew({...formData});
    }
  };

  const openModal = (
    message: string,
    yesText: string,
    noText: string,
    yesCallback: Function,
    noCallback: Function
  ) => {
    modalDispatch({
      type: 'show',
      payload: {
        body: <p>{message}<br /><br /></p>,
        buttons: <>
          <button
            className="button button--brown"
            onClick={() => noCallback()}
          >{noText}</button>
          <button
            className="button"
            onClick={() => yesCallback()}
          >{yesText}</button>
        </>
      }
    });
  }

  const handleNext = () => {
    if (formData !== null) {
      saveData();
    }
    nextForm();
  };

  const handleDelete = () => {
    // @ts-ignore-line
    let editingArray = [...formData[form]];
    let dataToSet: any = [];
    const index = editingData.index ? editingData.index - 1 : -1;
    if (index > -1) {
      dataToSet = [...editingArray];
      dataToSet.splice(index, 1);
    } else {
      dataToSet = [...editingArray, formData];
    }

    setFormData({...brew, [form]: dataToSet});
    updateBrew({...formData, [form]: dataToSet});
  };

  switch (form) {
    case 'settings':
      title = 'Settings';
      component = <BrewSettingsForm brew={brew} dataUpdated={setData} delete={deleteBrew} />
      submitText = 'Done';
      break;
    case 'fermentables':
      if (editingData) {
        title = 'Edit Fermentable';
        submitText = 'Edit';
      } else {
        title = 'Add Fermentable';
        submitText = '+ Add';
      }
      component = <AddFermentableForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'hops':
      if (editingData) {
        title = 'Edit Hop';
        submitText = 'Edit';
      } else {
        title = 'Add Hop';
        submitText = '+ Add';
      }
      component = <AddHopForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'yeast':
      if (editingData) {
        title = 'Edit Yeast';
        submitText = 'Edit';
      } else {
        title = 'Add Yeast';
        submitText = '+ Add';
      }
      component = <AddYeastForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'adjuncts':
      if (editingData) {
        title = 'Edit Adjunct';
        submitText = 'Edit';
      } else {
        title = 'Add Adjunct';
        submitText = '+ Add';
      }
      component = <AddAdjunctForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'mash':
      if (editingData) {
        title = 'Edit Mash Step';
        submitText = 'Edit';
      } else {
        title = 'Add Mash Step';
        submitText = '+ Add';
      }
      component = <MashForm brew={brew} dataUpdated={setData} editingData={editingData} />;
      break;
    case 'boil':
      title = 'Boil';
      component = <BoilForm brew={brew} dataUpdated={setData} />;
      submitText = 'Done';
      break;
    case 'fermentation':
      if (editingData) {
        title = 'Edit Fermentation Stage';
        submitText = 'Edit';
      } else {
        title = 'Edit Fermentation Stage';
        submitText = '+ Add';
      }
      component = <FermentationForm brew={brew} dataUpdated={setData} editingData={editingData} />;
      break;
    case 'packaging':
      title = 'Packaging';
      component = <PackagingForm brew={brew} dataUpdated={setData} />;
      submitText = 'Done';
      break;
    case 'notes':
      title = 'Notes';
      component = <NotesForm brew={brew} dataUpdated={setData} />;
      submitText = 'Done';
      break;
    case 'tags':
      title = 'Tags';
      component = <TagsForm brew={brew} dataUpdated={setData} saveData={saveData} />;
      submitText = 'Add Tag';
      break;
    default:
      title = '';
      component = null;
      submitText = '';
      break;
  }

  return(
    <div className={styles.formContainer}>
      {title.length > 0 ? <h2>{title}</h2> : null}
      <button
        className={`button button--link ${styles.sideBarClose}`}
        onClick={closeSidebar}
      >Done</button>
      {component}
      <div className={styles.formContainer__footer}>
        <button
          className="button button--green button--no-shadow"
          onClick={saveData}
        >{submitText}</button>
        <button
          className="button button--brown button--no-shadow"
          onClick={closeSidebar}
        >Cancel</button>
        {form !== 'tags' && editingData === null && !brewdayResults
          ? <button
              className="button button--no-shadow"
              onClick={handleNext}
            >Next</button>
          : <br />}
        {editingData !== null && editingData.type !== 'strike'
          ? <button
              className="button button--error button--no-shadow"
              onClick={handleDelete}
            >Delete</button>
          : null}
      </div>
    </div>
  );
};

export default FormHandler;