import React from 'react';

class LogoutCode extends React.Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return this.props.children;
  }
}

export default LogoutCode;
