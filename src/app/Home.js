import React from 'react';
import { Query } from 'react-apollo';
import 'app/styles/components/Home.css';
import EmployeeHome from 'app/EmployeeHome';
import { GET_USER_INFO } from 'template/Queries';
import Error from 'template/shared/Error';
import LoadingAnimation from 'template/shared/LoadingAnimation';

import RichTextEditorNew from './RichTextEditor_NEW';

const Home = props => (
  <Query query={GET_USER_INFO}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      const loggedIn = localStorage.getItem('loggedIn') === 'true';
      if (!loggedIn) {
        return (
          <div>
            <RichTextEditorNew />
            Welcome to City of Asheville Employee Check-in. Please log in at top right.
          </div>
        );
      }
      return (<EmployeeHome {...props} user={data} />);
    }}
  </Query>
);

export default Home;
