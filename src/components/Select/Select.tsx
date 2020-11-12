import React, { useState, useRef, RefObject } from "react";

import styles from './Select.module.scss';

type secondaryLabel = string | number | undefined;

export interface Option {
  value: string | number;
  label: string;
  color?: string;
  secondaryLabels?: secondaryLabel[]; // Can display up to two secondary labels
}

interface SelectProps {
  options: Option[];
  defaultLabel: string;
  value: string | number;
  includeSearch?: boolean;
  filters?: string[];
  disabled?: boolean;
  onChange: Function;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  defaultLabel,
  value,
  includeSearch,
  filters,
  disabled,
  onChange,
  className
}) => {
  const currentlySelected = options.find((option: Option) => option.value === value);
  const containerRef: RefObject<any> = useRef();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [optionsToDisplay, setOptionsToDisplay] = useState<Option[]>([]);

  React.useEffect(() => {
    setOptionsToDisplay(options);
  }, [options]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef]);

  const makeSelection = (value: number | string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange({value: value});
    setShowDropdown(false);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    const filteredOptions = options.filter((option: Option) => 
      option.label.toLowerCase().search(term) !== -1);
    setOptionsToDisplay(!!term ? filteredOptions : options);
  }

  return (
    <div
      className={`${styles.selectContainer} ${className} ${showDropdown && styles.show}`}
      ref={containerRef}
    >
      <button
        className={`${styles.selection} ${styles.light} ${disabled && styles.disabled}`}
        onClick={() => !disabled && setShowDropdown(true)}
      >
        {currentlySelected ? currentlySelected.label : defaultLabel}
      </button>
      {showDropdown && <div className={styles.selectDropdown}>
        {includeSearch && <input className={styles.search} type="text" placeholder="Search" onChange={handleSearch} />}
        {filters && <div className={styles.filter}>
            <select>
              {filters.map((filter: string) => <option value={filter}>{filter}</option>)}
            </select>
          </div>
        }
        <ul>
          {optionsToDisplay.map((option: Option) => (
            <li key={option.value}>
              <button className={styles.option} onClick={makeSelection(option.value)}>
          <span className={option.color && styles.color} style={option.color && {'--color': option.color}}>{option.label}</span>
                <span className={option.secondaryLabels!.length === 1 ? styles.alignRight : ''}>
                  {option.secondaryLabels!.length >= 1 &&<span>{option.secondaryLabels![0]}</span>}
                  {option.secondaryLabels!.length >= 2 && <span>{option.secondaryLabels![1]}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
};

export default Select;