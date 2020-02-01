import React, { useState } from 'react';

import componentStyles from './BrewComponents.module.scss';
import Tooltip from '../../../components/Tooltip/Tooltip';

interface Props {
  fieldName: string;
  value: any;
  editValue: Function;
  editing: boolean;
  setEditing: Function;
  brewdayResults: boolean;
  calculate?: Function;
  label?: string;
  noInputLabel?: boolean; // do not display a label when input is visible
  classes?: any;
}

const BrewEditableField = (props: Props) => {
  const {
    fieldName,
    value,
    editValue,
    label,
    classes,
    editing,
    setEditing,
    noInputLabel,
    brewdayResults,
    calculate
  } = props;

  const [showTooltip, setShowTooltip] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const openEditMenu = (event: any) => {
    event.stopPropagation();
    if (brewdayResults) {
      setShowTooltip(true);
    }
  }

  const closeEditMenu = (event: any) => {
    event.stopPropagation();
    setShowTooltip(false);
  }

  const handleEdit = (event: any) => {
    event.stopPropagation();
    setShowInput(true);
    setShowTooltip(false);
    setEditing(true);
  }

  const handleCalculate = (event: any) => {
    event.stopPropagation();
    calculate && calculate();
    setShowTooltip(false);
  }

  return (
    <span
      onMouseEnter={openEditMenu}
      onMouseLeave={closeEditMenu}
    >
      <Tooltip
        show={showTooltip && !editing}
        placement="top-center"
        onClose={() => closeEditMenu}
        className={componentStyles.editResultsMenu}
      >
        <button
          className={`button button--link button--small ${componentStyles.moreButton}`}
          onClick={handleEdit}
        >Edit</button>
        {calculate && <><hr className={componentStyles.divider} />
          <button
            className={`button button--link button--small ${componentStyles.moreButton}`}
            onClick={handleCalculate}
          >Calculate</button></>}
      </Tooltip>

      {showInput
        ? <>
            <input
              type="number"
              className={`${componentStyles.editInput} ${classes}`}
              autoFocus
              defaultValue={value}
              onBlur={e => {
                setShowInput(false);
                setEditing(false);
                editValue(e.currentTarget.value, fieldName);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setShowInput(false);
                  setEditing(false);
                  editValue([{value: e.currentTarget.value, choice: fieldName}]);
                }
              }}
            />{!noInputLabel && label ? label : ''}
          </>
        : value !== null ? `${value}${label ? label : ''}` : ''}
    </span>
  );
}

export default BrewEditableField;