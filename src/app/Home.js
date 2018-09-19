import React from 'react';
import 'app/styles/components/Home.css';
import EmployeeHome from 'app/EmployeeHome';
import { withUser } from 'template/UserContext';

const Home = (props) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (!loggedIn) {
    return (
      <div>
        Welcome to City of Asheville Employee Check-in. Please log in at top right.
      </div>
    );
  }
  return (<EmployeeHome {...props} />);
};

export default withUser(Home);
