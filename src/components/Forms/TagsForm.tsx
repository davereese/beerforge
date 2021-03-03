import React, { useState, useEffect, useRef } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../store/BrewContext';
import { usePrevious } from '../../resources/javascript/usePreviousHook';

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
  saveData: Function;
}

function TagsForm(props: Props) {
  const [formData, setFormData] = useState(props.brew);
  const [tags, setTags] = useState(props.brew.tags);

  const inputRef = useRef<HTMLInputElement>(null);
  const prevTags = usePrevious(props.brew.tags);

  const dataChanged = (type: string) => (event: any) => {
    const tagData = `${tags ? tags+',' : ''}${event.currentTarget.value}`;
    setFormData({...formData, [type]: tagData});
  };

  const removeTag = (tag: string, index: number) => (event: any) => {
    let tagData;
    if (index > 0) {
      tagData = tags ? tags.replace(','+tag, '') : '';
    } else {
      if (tags && tags.split(',').length > 1) {
        tagData = tags ? tags.replace(tag+',', '') : '';
      } else {
        tagData = tags ? tags.replace(tag, '') : '';
      }
    }

    setFormData({...formData, tags: tagData});
  };

  useEffect(() => {
    if (props.brew.tags !== prevTags) {
      if (inputRef.current && prevTags !== undefined) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
      setTags(props.brew.tags);
    }

    // If the brew had tags and now the tags in formData changed notify formHandler
    if ((props.brew.tags && formData.tags) || (props.brew.tags && formData.tags === '')) {
      if (props.brew.tags.length > formData.tags.length) {
        // If you deleted a tag, immediately save this to the brew in session
        props.dataUpdated(formData, {tagDeleted: true});
      } else {
        props.dataUpdated(formData);
      }
    } else {
      props.dataUpdated(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.brew, prevTags, formData]);

  return(
    <>
      {props.brew.tags
        ? <div className={styles.tagWrapper}>
            {props.brew.tags.split(',').map((tag, i) => {
              return <div className="tag" key={i}>
                {tag}
                <button className="removeTag" onClick={removeTag(tag, i)}>delete</button>
              </div>;
            })}
          </div>
        : null
      }
      <label>Tag<br />
        <input
          ref={inputRef}
          type="text"
          placeholder="tag name"
          onChange={dataChanged('tags')}
        />
      </label>
    </>
  );
};

export default TagsForm;