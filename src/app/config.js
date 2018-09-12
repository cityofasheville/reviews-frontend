const config = {
  // main configurations
  appTitle: 'A react app',
  appIntro: 'City of Asheville, NC',
  langSwitcher: true,
  authControl: true,
  footer: true,
  // languages for langSwitcher
  languages: [
    {
      language: 'English',
      label: 'English',
    },
    {
      language: 'Spanish',
      label: 'Espa\xF1ol',
    },
  ],
  // main menu items
  menu_items: [
    {
      href: '/about',
      active: false,
      text: 'About',
    },
  ],
  // cognito settings
  loginURL: 'https://coa-web-2.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=2uu574tlad2ajk5hmj94fnjeva&redirect_uri=http://localhost:3000/login', // eslint-disable-line
  logoutURL: 'https://coa-web-2.auth.us-east-1.amazoncognito.com/logout?client_id=2uu574tlad2ajk5hmj94fnjeva&logout_uri=http://localhost:3000/logout', // eslint-disable-line
  redirect_uri: 'http://localhost:3000/login', // eslint-disable-line
  // footer
  hasFeedbackForm: true,
  feedbackURL: 'https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1', // eslint-disable-line
  hasGitHubURL: true,
  gitHubURL: 'https://github.com/cityofasheville/simplicity2',

};

export default config;
