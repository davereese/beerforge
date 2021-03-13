import React, { useCallback, useEffect, useRef, useState } from 'react';
import SelectOption, { SelectOptionItem } from './SelectOption';

import styles from './Select.module.scss';

interface SelectProps {
  options: SelectOptionItem[];
  value: string | number;
  onChange: (event: {currentTarget: {value: number | string}}) => void;
  className?: string;
  placeholder?: string;
  useSearch?: boolean;
  optionHoverEffect?: (event: React.MouseEvent<HTMLInputElement>, delay?: number) => void;
  optionBlurEffect?: () => void;
  onMouseOut?: (delay?: number) => void;
  dropdownClosed?: () => void;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    className,
    placeholder,
    optionHoverEffect,
    optionBlurEffect,
    onMouseOut,
    dropdownClosed,
    useSearch = false
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [optionsLength, setOptionsLength] = useState<number>(options.length);
  const selectRef: any = useRef<HTMLDivElement>(null);
  const selectOptionsRef: any = useRef<HTMLDivElement>(null);

  const moveFocusUp = useCallback(() => {
    focusedIndex > 0 && setFocusedIndex(focusedIndex - 1);
  }, [focusedIndex]);

  const moveFocusDown = useCallback(() => {
    focusedIndex < optionsLength - 1 && setFocusedIndex(focusedIndex + 1);
  }, [focusedIndex, optionsLength]);

  const handleHover = useCallback((option: SelectOptionItem, event: React.MouseEvent<HTMLDivElement> | KeyboardEvent) => {
    const focusedNode = event.target as HTMLElement;
    const target = focusedNode.className.includes('option') ? event.currentTarget : selectOptionsRef.current.children[focusedIndex];
    const delay = focusedNode.className.includes('option') ? 500 : 0;
    const newEvent = {currentTarget: target} as React.MouseEvent<HTMLInputElement>;
    newEvent.currentTarget.value = option.value.toString();
    optionHoverEffect && optionHoverEffect(newEvent, delay);
  }, [optionHoverEffect, focusedIndex]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (open) {
        const element = event.target as HTMLElement;
        const targetIsSvg = element.nodeName === 'path' || element.nodeName === 'rect';

        if (
          !targetIsSvg &&
          ['searchAndFilters', 'placeholder', 'closeButton']
            .some(string => element.className.includes(string))
        ) {
          setIsSearching(!isSearching);
          return null;
        }

        if (
          targetIsSvg ||
          (selectOptionsRef.current &&
          !selectOptionsRef.current.contains(element) &&
          !element.className.includes('Popup'))
        ) {
          setOpen(false);
          setFocusedIndex(0);
          setSearchTerm("");
          setIsSearching(false);
          dropdownClosed && dropdownClosed();
        }
      }
    };

    const resetFocus = () => {
      setIsSearching(false);
      selectRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (open) {
        const searchAndFiltersHeight = useSearch ? 41 : 0;
        const topOfScrollableElement = selectOptionsRef.current.scrollTop + searchAndFiltersHeight;
        const bottomOfScrollableElement = selectOptionsRef.current.scrollTop + selectOptionsRef.current.offsetHeight + searchAndFiltersHeight;
        let focusedOption = selectOptionsRef.current.children[focusedIndex];

        switch (event.code) {
          case 'ArrowUp':
            event.preventDefault();
            if (!focusedOption) {
              return;
            }
            resetFocus();
            moveFocusUp();
            focusedOption = focusedIndex > 0
              ? selectOptionsRef.current.children[focusedIndex-1]
              : focusedOption;
            if (focusedOption.offsetTop - 5 < topOfScrollableElement) {
              selectOptionsRef.current.scrollTop = focusedOption.offsetTop - searchAndFiltersHeight - 5;
            } else if (focusedOption.offsetTop > bottomOfScrollableElement) {
              selectOptionsRef.current.scrollTop = focusedOption.offsetTop + focusedOption.offsetHeight - selectOptionsRef.current.offsetHeight - searchAndFiltersHeight;
            }
            onMouseOut && onMouseOut(0);
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (!focusedOption) {
              return;
            }
            resetFocus();
            moveFocusDown();
            focusedOption = focusedIndex < optionsLength - 1
              ? selectOptionsRef.current.children[focusedIndex+1]
              : focusedOption;
            if (
              focusedOption.offsetTop + 5 >= bottomOfScrollableElement ||
              focusedOption.offsetTop < topOfScrollableElement
            ) {
              selectOptionsRef.current.scrollTop = focusedOption.offsetTop - searchAndFiltersHeight - 5;
            }
            onMouseOut && onMouseOut(0);
            break;
          case 'ArrowLeft':
            handleHover(options[focusedIndex], event);
            break;
          case 'ArrowRight':
            onMouseOut && onMouseOut(0);
            break;
          case 'Enter':
            isSearching && event.preventDefault();
            break;
          default:
            return;
        }
      } else if (hasFocus && event.code === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [
    options,
    open,
    hasFocus,
    moveFocusUp,
    moveFocusDown,
    focusedIndex,
    optionsLength,
    setIsSearching,
    isSearching,
    useSearch,
    dropdownClosed,
    handleHover,
    onMouseOut
  ]);

  useEffect(() => {
    const filteredOptions = options.filter((option: SelectOptionItem) => {
      const optionText = option.label ?
        option.label :
        typeof option.option === "string" ?
          option.option as string :
          null;
      if (!searchTerm) {
        return option;
      }
      return optionText && optionText.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setOptionsLength(filteredOptions.length);
  }, [searchTerm, options]);

  const handleSelect = (value: number | string) => {
    onChange({currentTarget: {value: value}});
    setIsSearching(false);
    setSearchTerm("");
    setOpen(false);
    setFocusedIndex(0);
  }

  const onFocus = () => {
    setHasFocus(true);
  };

  const onBlur = () => {
    setHasFocus(false);
  };

  const handleBlur = () => {
    optionBlurEffect && optionBlurEffect();
  }

  const currentlySelectedOption = options.find(option => option.value === value);

  return (
    <div
      className={`${styles.selectContainer} ${className}`}
      onClick={() => !open && setOpen(true)}
      role="button"
      tabIndex={0}
      ref={selectRef}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseOut={() => onMouseOut && onMouseOut()}
    >
      <span>{!!currentlySelectedOption ? currentlySelectedOption?.label || currentlySelectedOption?.option : placeholder}</span>
      <div
        className={`${styles.selectDropdown} ${open && styles.open}`}
        aria-expanded={open}
      >
        {useSearch && (
          <div className={`${styles.searchAndFilters} ${isSearching ? styles.isSearching : ""}`}>
            {!isSearching &&
              <span
                className={`${styles.placeholder} ${searchTerm.length > 0 ? styles.isSearching : ""}`}
              >
                {searchTerm || "Search"}
              </span>
            }
            {isSearching && (
              <>
                <input
                  type="text"
                  placeholder="Search"
                  className={styles.selectSearch}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={0}
                  className={styles.closeButton}
                />
              </>
            )}
          </div>
        )}
        <div
          className={`${styles.selectOptions}`}
          ref={selectOptionsRef}
        >
          {open && options.filter((option: SelectOptionItem) => {
            const optionText = option.label ?
              option.label :
                typeof option.option === "string" ?
                  option.option as string :
                  null;
            if (!searchTerm) {
              return option;
            }
            return optionText && optionText.toLowerCase().includes(searchTerm.toLowerCase());
          }).map((option: SelectOptionItem, index: number) => (
            <SelectOption
              key={option.value}
              focused={focusedIndex === index}
              selected={option.value === value}
              onSelect={handleSelect}
              onHover={(event: React.MouseEvent<HTMLDivElement>) => handleHover(option, event)}
              onBlur={() => handleBlur()}
              {...option}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Select;