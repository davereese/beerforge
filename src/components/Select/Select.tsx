import React, { useCallback, useEffect, useRef, useState } from 'react';
import SelectOption, { SelectOptionItem } from './SelectOption';

import styles from './Select.module.scss';

interface SelectProps {
  options: SelectOptionItem[];
  value: string | number;
  onChange: (event: {currentTarget: {value: number | string}}) => void;
  className: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, className }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const selectOptionsRef: any = useRef<HTMLDivElement>(null);

  const moveFocusUp = useCallback(() => {
    focusedIndex > 0 && setFocusedIndex(focusedIndex - 1);
  }, [focusedIndex]);

  const moveFocusDown = useCallback(() => {
    focusedIndex < options.length && setFocusedIndex(focusedIndex + 1);
  }, [focusedIndex, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectOptionsRef.current && !selectOptionsRef.current.contains(event.target)) {
        setOpen(false);
        setFocusedIndex(0);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (open) {
        switch (event.code) {
          case 'ArrowUp':
            event.preventDefault();
            moveFocusUp();
            break;
          case 'ArrowDown':
            event.preventDefault();
            moveFocusDown();
            break;
          default:
            return;
        }
      } else if (hasFocus && event.code === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, hasFocus, moveFocusUp, moveFocusDown]);

  const handleSelect = (value: number | string) => {
    onChange({currentTarget: {value: value}});
    setOpen(false);
    setFocusedIndex(0);
  };

  const onFocus = () => {
    setHasFocus(true);
  };

  const onBlur = () => {
    setHasFocus(false);
  };

  const currentlySelectedOption = options.find(option => option.value === value);

  return (
    <div
      className={`${styles.selectContainer} ${className}`}
      onClick={() => !open && setOpen(true)}
      role="button"
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <span>{currentlySelectedOption?.label || currentlySelectedOption?.option}</span>
      <div
        className={`${styles.selectOptions} ${open && styles.open}`}
        ref={selectOptionsRef}
        aria-expanded={open}
      >
        {open && options.map((option: SelectOptionItem, index: number) => (
          <SelectOption
            key={option.value}
            focused={focusedIndex === index+1}
            selected={option.value === value}
            onSelect={handleSelect}
            {...option}
          />
        ))}
      </div>
    </div>
  );
};

export default Select;