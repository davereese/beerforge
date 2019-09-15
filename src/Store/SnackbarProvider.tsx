import React from 'react';

export interface SnackbarProviderInterface {
  hideSnackbar: Function;
  show: boolean;
  showSnackbar: Function;
};

export interface SnackbarInterface {
  message: string;
  status: 'error' | 'success' | 'warning';
}

export const SnackbarContext = React.createContext({
  hideSnackbar: () => null,
  show: false,
  showSnackbar: () => null
} as SnackbarProviderInterface);

let timeout: any;

export default class SnackbarProvider extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      hideSnackbar: this.hideSnackbar,
      show: false,
      showSnackbar: this.showSnackbar,
      closing: false,
      message: '',
      status: 'success',
    };
  }

  hideSnackbar = () => {
    this.setState({
      closing: true
    }, () => {
      window.setTimeout(() => {
        this.setState({
          show: false,
          closing: false,
          message: '',
          status: 'success',
        });
      }, 550);
    });
  };

  showSnackbar = (options: SnackbarInterface) => {
    clearTimeout(timeout);
    this.setState({
      show: true,
      message: options.message,
      status: options.status,
    }, () => {
      timeout = window.setTimeout(() => {
        this.hideSnackbar();
      }, 2500);
    });
  };

  render() {
    const { children } = this.props;
    return (
      // @ts-ignore-line
      <SnackbarContext.Provider value={this.state}>
        {children}
      </SnackbarContext.Provider>
    );
  }
}