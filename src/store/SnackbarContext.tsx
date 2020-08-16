import React, { useReducer, useContext } from 'react';

export interface SnackbarProviderInterface {
  hideSnackbar: Function;
  show: boolean;
  showSnackbar: Function;
};

export interface SnackbarInterface {
  message: string;
  status: 'error' | 'success' | 'warning';
}

const initialState: any = '';

export const SnackbarContext = React.createContext(initialState);

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'show':
      state = {
        show: true,
        closing: false,
        message: action.payload.message,
        status: action.payload.status,
      };
      return state;
    case 'hide':
      state = {
        ...state,
        closing: true
      };
      return state;
    case 'close':
      state = {
        show: false,
        closing: false,
        message: '',
        status: 'success',
      }
      return state;
    default:
      throw new Error('Unexpected action');
  }
};

const SnackbarProvider = ({ children }: any) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export default SnackbarProvider;
export { useSnackbar };