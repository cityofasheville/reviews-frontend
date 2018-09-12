import React from 'react';
import { Switch, Route } from 'react-router-dom';
import About from 'app/About';
import Home from 'app/Home';
import Login from 'template/Login';
import Logout from 'template/Logout';

const mainRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
  </Switch>
);

export default mainRoutes;
