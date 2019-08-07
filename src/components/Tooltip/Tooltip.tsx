import React, { useState, useEffect } from "react";

import styles from './Tooltip.module.scss';

interface Props {
  show: boolean;
  placement: 'bottom' | 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top' | 'top-center' | 'top-right' | 'top-left' | 'left-center';
  onClose: Function;
  children?: any;
  className?: any;
};

function Tooltip({
  show,
  children,
  placement,
  onClose,
  className,
}: Props) {
  const [closing, setClosing] = useState(false);
  const tooltipRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if ( tooltipRef.current) {
      tooltipRef.current.focus();
    }
  }, [tooltipRef]);

  useEffect(() => {
    let closeTimeout: any;

    if (closing) {
      closeTimeout = setTimeout(() => {
        setClosing(false);
        onClose();
      }, 350);
    }

    return () => {
      clearTimeout(closeTimeout);
    }
  }, [closing, onClose]);

  return show ? (
    <span
      className={`
        ${styles.tooltip}
        ${closing ? styles.close : null}
        ${placement ? styles[placement] : null}
        ${className}
      `}
      ref={tooltipRef}
      tabIndex={0}
      onBlur={() => setClosing(true)}
    >
      {children}
    </span>
  ) : null;
};

export default Tooltip;
