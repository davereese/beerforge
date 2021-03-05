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
    focusedIndex < options.length - 1 && setFocusedIndex(focusedIndex + 1);
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
        const topOfScrollableElement = selectOptionsRef.current.scrollTop;
        const bottomOfScrollableElement = selectOptionsRef.current.scrollTop + selectOptionsRef.current.offsetHeight;
        let focusedOption = selectOptionsRef.current.children[focusedIndex];
        switch (event.code) {
          case 'ArrowUp':
            event.preventDefault();
            moveFocusUp();
            focusedOption = focusedIndex > 0
              ? selectOptionsRef.current.children[focusedIndex-1]
              : focusedOption;
            if (focusedOption.offsetTop - 5 < topOfScrollableElement) {
              selectOptionsRef.current.scrollTop = focusedOption.offsetTop;
            } else if (focusedOption.offsetTop > bottomOfScrollableElement) {
              selectOptionsRef.current.scrollTop = focusedOption.offsetTop + focusedOption.offsetHeight - selectOptionsRef.current.offsetHeight;
            }
            break;
          case 'ArrowDown':
            event.preventDefault();
            moveFocusDown();
            focusedOption = focusedIndex < options.length - 1
              ? selectOptionsRef.current.children[focusedIndex+1]
              : focusedOption;
            if (
              focusedOption.offsetTop + 5 >= bottomOfScrollableElement ||
              focusedOption.offsetTop < topOfScrollableElement
            ) {
              selectOptionsRef.current.scrollTop = focusedOption.offsetTop - 5;
            }
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
  }, [open, hasFocus, moveFocusUp, moveFocusDown, focusedIndex, options.length]);

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
            focused={focusedIndex === index}
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