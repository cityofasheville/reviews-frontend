import React from 'react';
import { withRouter } from 'react-router-dom';
import config from 'app/config';
import { withUser } from './UserContext';

const saveLocationThenLogin = (location) => {
  localStorage.setItem('preLoginPathname', location.pathname);
  localStorage.setItem('preLoginSearch', location.search);
  window.location = config.loginURL;
};

const AuthControl = (props) => {
  console.log(props.user);
  if (props.user.loggedIn) {
    return (
      <a href={config.logoutURL}>Log out</a>
    );
  }
  return (
    <a
      href={config.loginURL}
      onClick={() => saveLocationThenLogin(props.location)}
    >
      Log in
    </a>
  );
};

export default withRouter(withUser(AuthControl));
