import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'app/Home';
import Reviews from 'app/Reviews';
import ReviewContainer from 'app/ReviewContainer';
import Login from 'template/Login';
import Logout from 'template/Logout';
import 'app/styles/styles.css'; // import your global css here if using
import 'app/styles/components/ReactTable.css';

const mainRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/check-ins" component={Reviews} />
    <Route path="/check-in" component={ReviewContainer} />
  </Switch>
);

export default mainRoutes;
