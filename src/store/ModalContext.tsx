import React, { useReducer, useContext } from 'react';

export interface ModalProviderInterface {
  show: boolean;
  showModal: Function;
  hideModal: Function;
};

export interface ModalInterface {
  title?: string;
  body?: any;
  node?: any;
  buttons?: any;
  classOverride?: any;
  closing: boolean;
  show: boolean;
  image: any;
}

export type Visibility = 'show' | 'hide' | 'close' | 'cancelHide';

const initialState: any = '';

export const ModalContext = React.createContext(initialState);

const reducer = (state: ModalInterface, action: {type: Visibility, payload: ModalInterface}) => {
  switch (action.type) {
    case 'show':
      state = {
        show: true,
        title: action.payload.title,
        body: action.payload.body,
        node: action.payload.node,
        buttons: action.payload.buttons,
        classOverride: action.payload.classOverride,
        closing: action.payload.closing,
        image: action.payload.image
      }
      return state;
    case 'hide':
      state = {
        ...state,
        closing: true,
      };
      return state;
    case 'close':
      state = {
        show: false,
        title: '',
        body: '',
        node: '',
        buttons: '',
        closing: false,
        classOverride: '',
        image: ''
      };
      return state;
    default:
      throw new Error('Unexpected action');
  }
};

const ModalProvider = ({ children }: any) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  return useContext(ModalContext);
};

export default ModalProvider;
export { useModal };