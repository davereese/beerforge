import React, { ComponentState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import styles from './Fade.module.scss';

class Fade extends React.Component<RouteComponentProps, ComponentState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      background: 'default',
      oldBackground: '',
      transitioned: true
    }
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const location = this.props.location.pathname.replace('/', '');
      const oldLocation = prevProps.location.pathname.replace('/', '');
      this.setState({
        background: location !== '' ? location : 'default',
        oldBackground: oldLocation !== '' ? `old-${oldLocation}` : 'old-default',
        transitioned: true,
      }, () => {
        setTimeout(() => {
          this.setState({transitioned: false});
        }, 100);
      });
    }
  }

  render() {
    return (
      <div className={`
        ${styles.fade}
        ${styles[this.state.background]}
        ${styles[this.state.oldBackground]}
        ${this.state.transitioned ? styles.transitioned : ''}
      `}>
        {this.props.children}
      </div>
    );
  }
}
export default withRouter(Fade);