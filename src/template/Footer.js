import React from 'react';
import config from 'app/config';
import { IM_GITHUB } from 'template/assets/iconConstants';
import Icon from 'template/shared/Icon';
import 'template/styles/components/Footer.css';

const Footer = () => (
  <div>
    <div className="clear-footer"></div>
    <footer className="footer">
      <div className="container">
        <div className="col-sm-12">
          {config.hasFeedbackForm
            && (
              <div>
                We strive for full accessibility. Report issues with our&nbsp;
                <a
                  className="inText"
                  href={config.feedbackURL}
                  target="_blank"
                  title="website feedback form"
                >
                  feedback form
                </a>
                .
              </div>
            )
          }
          {config.hasGitHubURL
            && (
              <div>
                It&apos;s open source! Fork it on&nbsp;
                <a
                  href={config.gitHubURL}
                  target="_blank"
                >
                  GitHub
                  <span style={{ marginLeft: '2px' }}>
                    <Icon
                      path={IM_GITHUB}
                      size={23}
                    />
                  </span>
                </a>
              </div>)
          }
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
