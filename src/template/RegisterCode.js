import React from 'react';
import config from 'app/config';

class RegisterCode extends React.Component {
  componentDidMount() {
    if (!this.props.loggedIn) {
      this.props.registerCode(
        {
          variables: {
            code: this.props.code,
            redirect_uri: config.redirect_uri,
          },
        }
      );
    }
  }

  render() {
    return this.props.children;
  }
}

export default RegisterCode;
