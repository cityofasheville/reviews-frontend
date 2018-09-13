/*
This file is how you configure the app in relation to the template. Do NOT edit any files inside the TEMPLATE file in your app's repo. Instead, you should just need to adjust the configuration settings in this file for the template portions of your project to work as expected.
*/

const config = {
  // main configurations
  appTitle: {
    defaultText: 'Employee Check-in',
    translations: [
      {
        language: 'English',
        text: 'Employee Check-in',
      },
    ],
  },
  appIntro: {
    defaultText: 'City of Asheville, NC',
    translations: [
      {
        language: 'English',
        text: 'City of Asheville, NC',
      },
    ],
  },
  langSwitcher: false, // Set to false if you do NOT want language translation to be enabled
  authControl: true, // Set to false if you do NOT want authentication to be enabled
  footer: false, // Set to false if you do NOT want footer to be shown
  languages: [ // languages for langSwitcher component
    {
      language: 'English',
      label: 'English',
    },
    {
      language: 'Spanish',
      label: 'Espa\xF1ol',
    },
  ],
  menu_items: [ // main menu items -- empty this array if there should not be a menu
    {
      href: 'https:/goo.gl/forms/iM81K4CIW3ZC1LM22',
      active: false,
      defaultText: 'Give feedback',
      external: true, // if links to external page not part of app
      translations: [
        {
          language: 'English',
          text: 'Give feedback',
        },
      ],
    },
  ],
  // cognito settings
  loginURL: process.env.REACT_APP_COGNITO_LOGIN, // eslint-disable-line
  logoutURL: process.env.REACT_APP_COGNITO_LOGOUT, // eslint-disable-line
  redirect_uri: 'http://localhost:3000/login', // eslint-disable-line
  loginText: {
    defaultText: 'Log in',
    translations: [
      {
        language: 'English',
        text: 'Log in',
      },
      {
        language: 'Spanish',
        text: 'Iniciar sesi\xF3n',
      },
    ],
  },
  logoutText: {
    defaultText: 'Log out',
    translations: [
      {
        language: 'English',
        text: 'Log out',
      },
      {
        language: 'Spanish',
        text: 'Cerrar sesi\xF3n',
      },
    ],
  },
  // footer
  hasFeedbackForm: true,
  feedbackURL: 'https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1', // eslint-disable-line
  hasGitHubURL: true,
  gitHubURL: 'https://github.com/cityofasheville/reviews-frontend',

};

export default config;
