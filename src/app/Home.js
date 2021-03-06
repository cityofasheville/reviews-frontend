import React from 'react';
import 'app/styles/components/Home.css';
import EmployeeHome from 'app/EmployeeHome';

import RichTextEditorNew from './RichTextEditor_NEW';

const Home = (props) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (!loggedIn) {
    return (
      <div>
        <RichTextEditorNew />
        Welcome to City of Asheville Employee Check-in. Please log in at top right.
      </div>
    );
  }
  return (<EmployeeHome {...props} />);
};

export default Home;
