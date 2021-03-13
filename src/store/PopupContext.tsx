import React, { useReducer, useContext, Dispatch } from 'react';
import { Visibility } from './ModalContext';

interface PopupActions {
  type: Visibility;
  payload?: Popup;
}

export interface PopupIngredient {
  name: string;
  category: string;
  details?: string[];
  description?: string;
}

export interface Popup {
  show?: boolean;
  closing?: boolean;
  ingredient?: PopupIngredient;
  coords?: DOMRect;
}

export const PopupContext = React.createContext<{
  state: Popup;
  dispatch: Dispatch<PopupActions>;
}>({
  state: {},
  dispatch: () => null
});

const reducer = (state: Popup, action: PopupActions) => {
  switch (action.type) {
    case 'show':
      state = {
        show: true,
        ingredient: action.payload?.ingredient,
        coords: action.payload?.coords,
        closing: false,
      }
      return state;
    case 'hide':
      state = {
        ...state,
        closing: true,
      };
      return state;
    case 'cancelHide':
      state = {
        ...state,
        closing: false,
      };
      return state;
    case 'close':
      state = {
        show: false,
        ingredient: undefined,
        coords: undefined,
        closing: false,
      };
      return state;
    default:
      throw new Error('Unexpected action');
  }
};

const PopupProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, {});
  return (
    <PopupContext.Provider value={{state, dispatch}}>
      {children}
    </PopupContext.Provider>
  );
};

const usePopup = () => {
  return useContext(PopupContext);
};

export default PopupProvider;
export { usePopup };