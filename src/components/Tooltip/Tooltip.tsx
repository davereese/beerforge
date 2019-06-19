import React, { useState, useEffect } from "react";

import styles from './Tooltip.module.scss';

interface Props {
  show: boolean;
  placement: 'bottom' | 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top' | 'top-center' | 'top-right' | 'top-left';
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

  const closeTooltip = () => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 350);
  };

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
      onBlur={closeTooltip}
    >
      {children}
    </span>
  ) : null;
};

export default Tooltip;
