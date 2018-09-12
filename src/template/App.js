import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Link } from 'react-router-dom';
import client from 'app/AppClient';
import config from 'app/config';
import mainRoutes from 'app/mainRoutes';
import Footer from 'template/Footer';
import LanguageProvider from 'template/LanguageContext';
import Navbar from 'template/Navbar';
import UserProvider from 'template/UserContext';
import logo from 'template/assets/logo.svg';
import 'template/styles/components/App.css';

const App = () => (
  <ApolloProvider client={client}>
    <main>
      <div className="App">
        <LanguageProvider>
          <UserProvider>
            <header className="App-header">
              <Link to="/">
                <img className="App-logo" src={logo} alt="City of Asheville logo"></img>
                <div className="App-title-container">
                  <h1 className="App-title">{config.appTitle}</h1>
                  <div className="App-intro">{config.appIntro}</div>
                </div>
              </Link>
              <Navbar />
            </header>
            <div className="container" id="content">
              {/* {props.children} */}
              {mainRoutes}
            </div>
            {config.footer && <Footer />}
          </UserProvider>
        </LanguageProvider>
      </div>
    </main>
  </ApolloProvider>
);

export default App;
