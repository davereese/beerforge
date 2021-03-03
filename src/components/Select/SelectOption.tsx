import React, { useEffect } from 'react';

import styles from './Select.module.scss';

export interface SelectOptionItem {
  option: JSX.Element | string;
  value: number | string;
  label?: string;
}

interface OptionProps extends SelectOptionItem {
  selected: boolean;
  focused: boolean;
  onSelect: (value: number | string) => void;
}

const SelectOption: React.FC<OptionProps> = (
  { option, value, selected, focused, onSelect }
) => {

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        onSelect(value);
      }
    }
    focused && document.addEventListener("keypress", handleKeyPress);

    return () => {
      focused && document.removeEventListener("keypress", handleKeyPress);
    }
  }, [onSelect, value, focused]);

  return <div
    role="option"
    aria-selected={selected}
    className={`${styles.option} ${focused ? styles.focused : ""} ${selected ? styles.selected : ""}`}
    onClick={() => onSelect(value)}
  >
    {option}
  </div>;
};

export default SelectOption;