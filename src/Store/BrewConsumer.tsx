import React from 'react';
import {ThemeContext} from './BrewProvider';

export default class Consumer extends React.Component {
  render() {
    const {children} = this.props;

    return (
      <ThemeContext.Consumer>
        {
          // @ts-ignore-line
          ({brew, updateBrew, saveBrewToDB, getBrewfromDB, clearBrew}) => {
            return React.Children.map(children, child =>
              // @ts-ignore-line
              React.cloneElement(child, {
                brew,
                updateBrew,
                saveBrewToDB,
                getBrewfromDB,
                clearBrew,
              })
            );
          }
        }
      </ThemeContext.Consumer>
    );
  }
}