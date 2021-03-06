/* **********************************************************************************************
  WARNING: DO NOT EDIT this file except from inside the react-starter-template repository. Changes made to this file inside child repos will NOT be reflected in the parent source template repository, and will generate code conflicts.
*********************************************************************************************** */
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import client from 'app/AppClient';
import config from 'app/config';
import mainRoutes from 'app/mainRoutes';
import AppTitle from 'template/AppTitle';
import Footer from 'template/Footer';
import LanguageProvider from 'template/LanguageContext';
import Navbar from 'template/Navbar';
import 'template/styles/components/App.css';

const App = () => (
  <ApolloProvider client={client}>
    <main>
      <div className="App">
        <LanguageProvider>
          <header className="App-header">
            <AppTitle />
            <Navbar />
          </header>
          <div className="container" id="content">
            {mainRoutes}
          </div>
          {config.footer && <Footer />}
        </LanguageProvider>
      </div>
    </main>
  </ApolloProvider>
);

export default App;
