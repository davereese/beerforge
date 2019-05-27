import React from 'react';

export interface brew {
  name: string
};

const DEFAULT_STATE = {
  brew: {
    name: '',
  } as brew
};

export const ThemeContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  updateBrew = (brew: brew): void => {
    this.setState({brew});
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          updateBrew: this.updateBrew,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}