import React from 'react';

import styles from '../Brew.module.scss';
import { transformNotes } from '../BrewUtils';
import { BrewInterface } from '../../../Store/BrewContext';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: any;
  user: any;
}

const BrewNotes = (props: Props) => {
  const {brew, readOnly, openSideBar} = props;
  return (
    <div className={styles.brew__section}>
      <div className={styles.brew__header}>
        <h2>Notes</h2>
        {!readOnly
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('notes')}
            ><span>Edit</span></button>
          : null}
      </div>
      <div className={styles.brew__notes}>
        {brew.notes
          ? <div dangerouslySetInnerHTML={transformNotes(brew)} />
          : null
        }
      </div>
      <div className={styles.tagsWrapper}>
        {brew.tags
          ? brew.tags.split(',').map((tag: string, i: number) => {
              return <div className="tag" key={i}>{tag}</div>
            })
          : null
        }
        {!readOnly
          ? <button
            className={`button ${styles.tagsButton}`}
            onClick={openSideBar('tags')}
          >Tags</button>
        : null}
      </div>
    </div>
  );
}

export default BrewNotes;