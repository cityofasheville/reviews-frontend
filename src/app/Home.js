import React from 'react';
import 'app/styles/components/Home.css';
//import EmployeeHome from './EmployeeHome';
import { withUser } from 'template/UserContext';

const Home = (props) => {
  if (!props.user.loggedIn) {
    return (
      <div>
        Welcome to City of Asheville Employee Check-in. Please log in at top right.
      </div>
    );
  }
  if (props.user.loggedIn && !props.user.email.trim().endsWith('ashevillenc.gov')) {
    return (<div>Invalid user</div>);
  }
  return <div>Employee Home</div>;
    //return (<EmployeeHome {...props} />);
};

export default withUser(Home);
