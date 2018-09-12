import React from 'react';

const UserContext = React.createContext();

export default class UserProvider extends React.Component {
  state = {
    loggedIn: false,
    address: null,
    birthdate: null,
    email: null,
    family_name: null,
    gender: null,
    given_name: null,
    locale: null,
    middle_name: null,
    name: null,
    nickname: null,
    phone_number: null,
    picture: null,
    preferred_username: null,
    profile: null,
    timezone: null,
    updated_at: null,
    website: null,
    id: null,
    is_employee: null,
    position: null,
    department: null,
    division: null,
    supervisor_id: null,
    supervisor: null,
    supervisor_email: null,
    login: () => (
      this.setState({loggedIn: true})
    ),
    setUserInfo: userInfo => (
      this.setState((prevState) => (Object.assign( prevState, userInfo )))
    ),
    logout: () => (
      this.setState({
        loggedIn: false,
        address: null,
        birthdate: null,
        email: null,
        family_name: null,
        gender: null,
        given_name: null,
        locale: null,
        middle_name: null,
        name: null,
        nickname: null,
        phone_number: null,
        picture: null,
        preferred_username: null,
        profile: null,
        updated_at: null,
        website: null,
        id: null,
        is_employee: null,
        position: null,
        department: null,
        division: null,
        supervisor_id: null,
        supervisor: null,
        supervisor_email: null,
      })
    ),
  }

  render() {
    return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider>;
  }
}

export function withUser(Component) {
  return function UseredComponent(props) {
    return (
      <UserContext.Consumer>
        {context => <Component {...props} user={context} />}
      </UserContext.Consumer>
    );
  };
}
