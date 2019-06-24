import React from 'react';

export interface ModalProviderInterface {
  hideModal: Function;
  show: boolean;
  showModal: Function;
};

export interface ModalInterface {
  title: string;
  body: any;
  buttons: any;
  classOverride: any;
}

export const ModalContext = React.createContext({
  hideModal: () => null,
  show: false,
  showModal: () => null
} as ModalProviderInterface);

export default class ModalProvider extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      hideModal: this.hideModal,
      show: false,
      showModal: this.showModal,
      title: '',
      body: '',
      classOverride: '',
      buttons: '',
      closing: false,
    };
  }

  hideModal = () => {
    this.setState({
      closing: true
    }, () => {
      window.setTimeout(() => {
        this.setState({
          show: false,
          title: '',
          body: '',
          buttons: '',
          closing: false,
          classOverride: ''
        });
      }, 350);
    });
  };

  showModal = (options: ModalInterface) => {
    this.setState({
      show: true,
      title: options.title,
      body: options.body,
      buttons: options.buttons,
      classOverride: options.classOverride,
    });
  };

  render() {
    const { children } = this.props;
    return (
      // @ts-ignore-line
      <ModalContext.Provider value={this.state}>
        {children}
      </ModalContext.Provider>
    );
  }
}