import React from 'react';

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

export interface UserInterface {
  currentUser?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    token: string;
    date_joined: string;
  }
};

const DEFAULT_STATE = {currentUser: ls.load('currentUser')};

export const UserContext = React.createContext(DEFAULT_STATE);

export default class UserProvider extends React.Component {
  state = DEFAULT_STATE;

  saveUser = (userData: UserInterface): void => {
    this.setState({currentUser: userData.currentUser});
    // keep users logged in for 12 hours
    ls.save('currentUser', userData.currentUser, 720);
  };

  updateUser = (userData: UserInterface): void => {
    const storage = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // @ts-ignore-line
    var record = {value: JSON.stringify(userData.currentUser), timestamp: storage.timestamp}
		localStorage.setItem('currentUser', JSON.stringify(record));
    this.setState({currentUser: userData.currentUser});
  };

  loadUser = (): void => {
    const user = ls.load('currentUser');
    this.setState({currentUser: user !== false ? user : false});
  };

  logOutUser = (): void => {
    localStorage.removeItem('currentUser');
    this.setState({currentUser: false});
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          // @ts-ignore-line
          saveUser: this.saveUser,
          updateUser: this.updateUser,
          loadUser: this.loadUser,
          logOutUser: this.logOutUser,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}