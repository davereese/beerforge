import React, { ReactElement, useState } from 'react';

import styles from './FormHandler.module.scss';
import { BrewInterface } from '../../../Store/BrewProvider';
import BrewSettingsForm from '../../../components/Forms/BrewSettingsForm';
import AddFermentableForm from '../../../components/Forms/AddFermentableForm';
import AddHopForm from '../../../components/Forms/AddHopForm';
import AddYeastForm from '../../../components/Forms/AddYeastForm';
import MashForm from '../../../components/Forms/MashForm';
import BoilForm from '../../../components/Forms/BoilForm';
import FermentationForm from '../../../components/Forms/FermentationForm';
import PackagingForm from '../../../components/Forms/PackagingForm';
import NotesForm from '../../../components/Forms/NotesForm';

interface Props {
  form: string;
  nextForm: any;
  closeSidebar: any;
  updateBrew: Function;
  brew: BrewInterface;
}

function FormHandler({
  form,
  nextForm,
  brew,
  closeSidebar,
  updateBrew,
}: Props) {

  let title: string,
      component: ReactElement | null,
      submitText: string;
  const [formData, setFormData] = useState<BrewInterface | null>({});

  // Stuff that isn't supposed to be part of the brew
  const [optionData, setOptionData] = useState<any | null>({});

  const setData = (data: any, options: any = null) => {
    setFormData(data);
    setOptionData(options);
  };

  const saveData = () => {
    if (optionData && optionData.secondary === false && formData) {
      delete formData.secondaryLength;
      delete formData.secondaryTemp;
    }
    updateBrew({...formData});
  };

  const handleNext = () => {
    updateBrew({...formData});
    nextForm();
  };

  switch (form) {
    case 'settings':
      title = 'Settings';
      component = <BrewSettingsForm data={brew} dataUpdated={setData} />
      submitText = 'Submit';
      break;
    case 'fermentables':
      title = 'Add Fermentable';
      component = <AddFermentableForm data={brew} dataUpdated={setData} />;
      submitText = '+ Add';
      break;
    case 'hops':
      title = 'Add Hop';
      component = <AddHopForm data={brew} dataUpdated={setData} />;
      submitText = '+ Add';
      break;
    case 'yeast':
      title = 'Add Yeast';
      component = <AddYeastForm data={brew} dataUpdated={setData} />;
      submitText = '+ Add';
      break;
    case 'mash':
      title = 'Mash';
      component = <MashForm data={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'boil':
      title = 'Boil';
      component = <BoilForm data={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'fermentation':
      title = 'Fermentation';
      component = <FermentationForm data={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'packaging':
      title = 'Packaging';
      component = <PackagingForm data={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'notes':
      title = 'Notes';
      component = <NotesForm data={brew} dataUpdated={setData} />;
      submitText = 'Submit';
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
        {form !== 'notes' ?
          <button
            className="button button--no-shadow"
            onClick={handleNext}
          >Next</button>
        : <br />}
      </div>
    </div>
  );
};

export default FormHandler;