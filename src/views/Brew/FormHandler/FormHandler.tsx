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
import { BrewInterface } from '../../../Store/BrewContext';
import { useBrew } from '../../../Store/BrewContext';
import TagsForm from '../../../components/Forms/TagsForm';
import { isEquivalent } from '../../../resources/javascript/isEquivalent';

interface Props {
  form: string;
  nextForm: any;
  editingData: any;
  closeSidebar: any;
  deleteBrew: Function;
  updateBrew: Function;
  open: boolean;
}

function FormHandler({
  form,
  nextForm,
  editingData,
  closeSidebar,
  updateBrew,
  deleteBrew,
  open,
}: Props) {

  let title: string,
      component: ReactElement | null,
      submitText: string;
  // eslint-disable-next-line
  const [brew, brewDispatch] = useBrew();
  const [formData, setFormData] = useState<BrewInterface | null>(null);

  // Stuff that isn't supposed to be part of the brew
  const [optionData, setOptionData] = useState<any | null>({});

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    if (optionData && optionData.tagDeleted) { saveData() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionData]);

  const setData = (data: any, options: any = null) => {
    setFormData(data);
    setOptionData(options);
  };

  const handleKeyDown = (e: any) => {
    // submit and go to the next form on 'enter' press
    if (open && e.keyCode === 13) {
      handleNext();
    }
  };

  const saveData = () => {
    // remove secondary fermentation data if it has been removed in the form
    if (optionData && optionData.secondary === false && formData) {
      // delete formData.secondaryLength;
      // delete formData.secondaryTemp;
    }
    updateBrew({...formData});
  };

  const handleNext = () => {
    if (formData !== null) {
      updateBrew({...formData});
    }
    nextForm();
  };

  const handleDelete = () => {
    // @ts-ignore-line
    let editingArray = [...formData[form]];
    let dataToSet: any = [];
    const index = editingArray.findIndex(entry => isEquivalent(entry, editingData));

    if (index > -1) {
      dataToSet = editingArray;
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
      submitText = 'Submit';
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
      submitText = 'Submit';
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
      submitText = 'Submit';
      break;
    case 'notes':
      title = 'Notes';
      component = <NotesForm brew={brew} dataUpdated={setData} />;
      submitText = 'Submit';
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
        {form !== 'tags' && editingData === null
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