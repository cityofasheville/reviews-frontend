/*
This file is how you configure the app in relation to the template. Do NOT edit any files inside the TEMPLATE file in your app's repo. Instead, you should just need to adjust the configuration settings in this file for the template portions of your project to work as expected.
*/

const config = {
  // main configurations
  appTitle: {
    defaultText: 'A react app',
    translations: [
      {
        language: 'English',
        text: 'A react app',
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
  langSwitcher: true, // Set to false if you do NOT want language translation to be enabled
  authControl: true, // Set to false if you do NOT want authentication to be enabled
  footer: true, // Set to false if you do NOT want footer to be shown
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
      href: '/about',
      active: false,
      defaultText: 'About',
      external: false, // if links to external page not part of app
      translations: [
        {
          language: 'English',
          text: 'About',
        },
        {
          language: 'Spanish',
          text: 'Acerca de',
        },
      ],
    },
  ],
  // cognito settings
  loginURL: 'https://coa-web-2.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=2uu574tlad2ajk5hmj94fnjeva&redirect_uri=http://localhost:3000/login', // eslint-disable-line
  logoutURL: 'https://coa-web-2.auth.us-east-1.amazoncognito.com/logout?client_id=2uu574tlad2ajk5hmj94fnjeva&logout_uri=http://localhost:3000/logout', // eslint-disable-line
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
  gitHubURL: 'https://github.com/cityofasheville/simplicity2',

};

export default config;
