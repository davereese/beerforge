import React from 'react';

import styles from './Modal.module.scss';

class Modal extends React.Component<any, any> {
  modalRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.modalRef = React.createRef<HTMLDivElement>();
  };

  closeModal = (e: any) => {
    const { modalProps } = this.props;
    const node = this.modalRef.current;
    // ignore if click is inside the modal
    if (node && node.contains(e.target)) {
      return;
    }

    if (modalProps.show) {
      modalProps.hideModal();
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.closeModal, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.closeModal, false);
  }

  render() {
    const { modalProps } = this.props;

    return modalProps.show ? (
      <div className={`${styles.modalOverlay} ${modalProps.closing ? styles.close : null}`}>
        <div className={styles.modal} ref={this.modalRef}>
          <header dangerouslySetInnerHTML={{__html: modalProps.title}} />
          {modalProps.body}
          {modalProps.buttons
            ? <div className={styles.modalButtons}>
                {modalProps.buttons}
              </div>
            : null}
        </div>
      </div>
    ) : null;
  }
}

export default Modal;