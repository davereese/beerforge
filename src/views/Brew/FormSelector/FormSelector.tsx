import React, { ReactElement } from 'react';

import styles from './FormSelector.module.scss';
import BrewSettingsForm from '../../../components/Forms/BrewSettingsForm/BrewSettingsForm';

interface Props {
  form: string;
}

function FormSelector({
  form
}: Props) {

  let title: string;
  let component: ReactElement | null;

  switch (form) {
    case 'settings':
      title = 'Settings';
      component = <BrewSettingsForm />
      break;
    case 'fermentables':
      title = 'Add Fermentable';
      component = null;
      break;
    case 'hops':
      title = 'Add Hop';
      component = null;
      break;
    case 'yeast':
      title = 'Add Yeast';
      component = null;
      break;
    case 'mash':
      title = 'Mash';
      component = null;
      break;
    case 'boil':
      title = 'Boil';
      component = null;
      break;
    case 'fermentation':
      title = 'Fermentation';
      component = null;
      break;
    case 'packaging':
      title = 'Packaging';
      component = null;
      break;
    case 'notes':
      title = 'Notes';
      component = null;
      break;
    default:
      title = '';
      component = null;
      break;
  }

  return(
    <div className={styles.formContainer}>
      {title.length > 0 ? <h2>{title}</h2> : null}
      {component}
    </div>
  );
};

export default FormSelector;