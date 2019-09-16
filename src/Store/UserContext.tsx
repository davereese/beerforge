import React, { useReducer, useContext } from 'react';

export interface UserInterface {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  token: string;
  date_joined: string;
};

// check local storage for user
export const ls = {
	save : function(key: string, jsonData: any, expirationMin: number) {
		var expirationMS = expirationMin * 60 * 1000;
		var record = {value: JSON.stringify(jsonData), timestamp: new Date().getTime() + expirationMS}
		localStorage.setItem(key, JSON.stringify(record));
		return jsonData;
	},
	load : function(key: string) {
    var record = JSON.parse(localStorage.getItem(key) || '{}');
    if (!record) {
      return false;
    }
    if (new Date().getTime() < record.timestamp) {
      return JSON.parse(record.value);
    } else {
      localStorage.removeItem(key);
      return false;
    }
	}
}

const initialState = ls.load('currentUser');

export const UserContext = React.createContext(initialState);

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'save':
      state = action.payload;
      // keep users logged in for 12 hours
      ls.save('currentUser', state, 720);
      return state;
    case 'update':
      const storage = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const record = {value: JSON.stringify(action.payload), timestamp: storage.timestamp}
      localStorage.setItem('currentUser', JSON.stringify(record));
      state = action.payload;
      return state;
    case 'load':
      const user = ls.load('currentUser');
      state = user !== false ? user : false;
      return state;
    case 'logout':
      localStorage.removeItem('currentUser');
      return false;
    default:
      throw new Error('Unexpected action');
  }
};

const UserProvider = ({ children }: any) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;
export { useUser };