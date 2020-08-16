import React, { useEffect } from 'react';

import styles from './Modal.module.scss';
import { useModal } from '../../store/ModalContext';

const Modal = () => {
  const modalRef = React.createRef<HTMLDivElement>();
  const [modal, modalDispatch] = useModal();

  useEffect(() => {
    if (modal.closing === true) {
      window.setTimeout(() => {
        modalDispatch({type: 'close'});
      }, 350);
    }
  }, [modal, modalDispatch]);

  const closeModal = (e: any) => {
    const node = modalRef.current;
    // ignore if click is inside the modal
    if (node && node.contains(e.target)) {
      return;
    }

    if (modal.show) {
      modalDispatch({type: 'hide'});
    }
  };

  return modal && modal.show ? (
    <div
      className={`${styles.modalOverlay} ${modal.classOverride} ${modal.closing ? styles.close : null}`}
      onMouseDown={closeModal}
    >
      <div className={styles.modal} ref={modalRef}>
        {modal.image && modal.image}
        {modal.title &&
          <header dangerouslySetInnerHTML={{__html: modal.title}} />
        }
        {modal.body}
        {modal.node && modal.node}
        {modal.buttons &&
          <div className={styles.modalButtons}>
            {modal.buttons}
          </div>
        }
      </div>
    </div>
  ) : null;
}

export default Modal;